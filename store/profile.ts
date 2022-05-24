import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { Severity } from '@sentry/types'
import {
  GDPRRequest,
  RecordFields,
  Scholar,
  ScholarPrivate,
  ScholarSocialMedia,
  Users,
  WWDCYearInfo,
  CloudKit
} from '@wwdcscholars/cloudkit'
import { v4 as uuid } from 'uuid'
import { RootState } from '~/store'
import { arrayWithoutIndex } from '~/util/array'
import { resizeImage } from '~/util/image'

export const name = 'profile'

export const types = {
  setDownloadRequest: 'setDownloadRequest'
}

export interface State {
  downloadRequest?: GDPRRequest
}

export const state = (): State => ({
  downloadRequest: undefined
})

export const getters: GetterTree<State, RootState> = {
  scholar(state, getters, rootState, rootGetters): Scholar | undefined {
    const userScholarReference = rootState.auth.userScholarReference
    if (!userScholarReference) return undefined

    const scholar = rootGetters['scholars/byRecordName'](userScholarReference.recordName) as Scholar

    return scholar
  },
  hasPendingDownloadRequest(state): boolean {
    return !!state.downloadRequest
  }
}

export const actions: ActionTree<State, RootState> = {
  async loadScholar({ rootState, dispatch }) {
    const userScholarReference = rootState.auth.userScholarReference
    if (!userScholarReference) return

    // fetches the scholar if it's not already available
    return dispatch('scholars/fetchScholar', userScholarReference.recordName, { root: true })
  },
  async loadPrivate({ getters, dispatch }) {
    const scholar = getters.scholar as Scholar
    if (!scholar || !scholar.scholarPrivate) return

    return dispatch('scholars/loadPrivateIfMissing', {
      scholarRecordName: scholar.recordName,
      privateRecordName: scholar.scholarPrivate.recordName
    }, { root: true })
  },
  async loadSocial({ getters, dispatch }) {
    const scholar = getters.scholar as Scholar
    if (!scholar) return

    return dispatch('scholars/loadSocialMediaIfMissing', {
      scholarRecordName: scholar.recordName,
      socialMediaRecordName: scholar.socialMedia.recordName
    }, { root: true })
  },
  async loadYearInfo({ getters, dispatch }, yearInfoRecordName: string) {
    const scholar = getters.scholar as Scholar
    if (!scholar) return

    return dispatch('scholars/loadYearInfoIfMissing', {
      scholarRecordName: scholar.recordName,
      yearInfoRecordName
    }, { root: true })
  },
  async loadDownloadRequest({ getters, commit }) {
    const scholar: Scholar = getters.scholar
    if (!scholar) return

    const results = await GDPRRequest.query({
      filterBy: [{
        fieldName: 'type',
        comparator: CloudKit.QueryFilterComparator.EQUALS,
        fieldValue: { value: 'download' }
      }, {
        fieldName: 'status',
        comparator: CloudKit.QueryFilterComparator.NOT_EQUALS,
        fieldValue: { value: 'fulfilled' }
      }, {
        fieldName: 'scholar',
        comparator: CloudKit.QueryFilterComparator.EQUALS,
        fieldValue: { value: { recordName: scholar.recordName! } }
      }]
    })

    if (results && results[0]) {
      commit(types.setDownloadRequest, results[0])
    }
  },

  async saveGDPRConsent({ getters, commit }): Promise<void> {
    if (!getters.scholar) return

    const scholar = Scholar.clone(getters.scholar)
    scholar.gdprConsentAt = new Date().getTime()
    await scholar.save()
    commit('scholars/insertScholar', scholar, { root: true })
  },
  async saveBasic({ getters, commit }, { scholar, changes }: { scholar: Scholar; changes: RecordFields }): Promise<void> {
    let updatedPrivate: ScholarPrivate | undefined
    if (changes.hasOwnProperty('email') || changes.hasOwnProperty('birthday')) {
      // when the email or birthday was changed, we need to update the ScholarPrivate object
      if (getters.scholar?.loadedPrivate) {
        updatedPrivate = ScholarPrivate.clone(getters.scholar.loadedPrivate)
      } else {
        updatedPrivate = new ScholarPrivate()
        updatedPrivate.recordName = uuid().toUpperCase()
        updatedPrivate.scholar = {
          recordName: scholar.recordName!,
          action: CloudKit.ReferenceAction.DELETE_SELF
        }
        // when we created a new ScholarPrivate, we need to set the reference on Scholar
        changes['scholarPrivate'] = { value: {
          recordName: updatedPrivate.recordName!,
          action: CloudKit.ReferenceAction.DELETE_SELF
        }}
      }

      if (changes['email']) {
        updatedPrivate!.email = changes['email'].value as string
      }
      if (changes['birthday']) {
        updatedPrivate!.birthday = changes['birthday'].value as number
      }

      delete changes['email']
      await updatedPrivate!.save()
    }

    let loadedPrivateForFetch: ScholarPrivate | undefined
    if (Object.keys(changes).length > 0) {
      // If the profile picture changed, resize it
      if (changes['profilePicture'] && changes['profilePicture']['value'] instanceof File) {
        const result = await resizeImage(changes['profilePicture']['value'], this.$g('profile.picture.maxSize'))
        changes['profilePicture']['value'] = result
      }

      if (changes['profilePicture'] && scholar.loadedPrivate) {
        // cache the loadedPrivate to set it back to the scholar later
        loadedPrivateForFetch = scholar.loadedPrivate
      }

      let updatedScholar = Scholar.clone(scholar) as Scholar
      updatedScholar.setFields(changes)
      await updatedScholar.save()

      // If the profile picture changed, we have to fetch the record again to get the new downloadURL
      // Afterwards set the private again
      if (changes['profilePicture']) {
        updatedScholar = await Scholar.fetch(updatedScholar.recordName!)
      }
      commit('scholars/insertScholar', updatedScholar, { root: true })
    }

    // when the private changed or we fetched a new scholar because the picture changed, we have to set the loadedPrivate again
    if (updatedPrivate || loadedPrivateForFetch) {
      const recordName = (updatedPrivate || loadedPrivateForFetch)?.scholar.recordName
      if (!recordName) return
      commit('scholars/setScholarPrivate', {
        scholarRecordName: recordName,
        scholarPrivate: updatedPrivate || loadedPrivateForFetch
      }, { root: true })
    }
  },
  async saveYearInfo({ commit }, { yearInfo, changes }: { yearInfo: WWDCYearInfo, changes: RecordFields }) {
    if (changes['screenshots'] && changes['screenshots']['value']) {
      const promises = (changes['screenshots']['value'] as CloudKit.RecordField[])
        .map(screenshot => {
          if (screenshot instanceof File) {
            return resizeImage(screenshot, this.$g('submission.screenshot.maxSize'))
          } else {
            return new Promise(resolve => resolve(screenshot))
          }
        })

      changes['screenshots']['value'] = await Promise.all(promises) as any
    }

    let updatedYearInfo = WWDCYearInfo.clone(yearInfo)
    updatedYearInfo.setFields(changes)
    await updatedYearInfo.save()

    // When screenshots changed, we have to fetch the record again
    if (changes['screenshots']) {
      updatedYearInfo = await WWDCYearInfo.fetch(updatedYearInfo.recordName!)
    }

    commit('scholars/setScholarYearInfo', {
      scholarRecordName: updatedYearInfo.scholar.recordName,
      yearInfo: updatedYearInfo
    }, { root: true })
  },
  async createYearInfo({ getters, commit }, formData) {
    const yearInfo = new WWDCYearInfo()
    yearInfo.recordName = uuid().toUpperCase()

    yearInfo.appliedAs = formData.appliedAs
    yearInfo.description = formData.description
    if (formData.videoLink) {
      yearInfo.videoLink = formData.videoLink
    }
    if (formData.githubLink) {
      yearInfo.githubLink = formData.githubLink
    }
    if (formData.appstoreLink) {
      yearInfo.appstoreLink = formData.appstoreLink
    }
    yearInfo.screenshots = await Promise.all(
      formData.screenshots
        .map(s => resizeImage(s, this.$g('submission.screenshot.maxSize'))
      )
    )
    yearInfo.acceptanceEmail = await resizeImage(formData.acceptanceEmail, this.$g('submission.acceptanceEmail.maxSize')) as any
    yearInfo.status = 'pending'
    yearInfo.scholar = {
      recordName: getters.scholar.recordName,
      action: CloudKit.ReferenceAction.DELETE_SELF
    }
    yearInfo.year = {
      recordName: formData.year,
      action: CloudKit.ReferenceAction.NONE
    }

    const scholar = Scholar.clone(getters.scholar)
    scholar.wwdcYearInfos = [
      ...scholar.wwdcYearInfos,
      {
        recordName: yearInfo.recordName,
        action: CloudKit.ReferenceAction.NONE
      }
    ]
    scholar.wwdcYears = [
      ...scholar.wwdcYears,
      {
      recordName: formData.year,
      action: CloudKit.ReferenceAction.NONE
      }
    ]

    const batch = this.$ck.newRecordsBatchInPublicDatabase()
      .create([yearInfo.recordToSave])
      .update([scholar.recordToSave])

    const result = await batch.commit()
    if (result.hasErrors) {
      this.$sentry.captureException(new Error('Error while saving records'), scope => {
        result.errors.forEach(e => scope.addBreadcrumb({
          type: 'CKError',
          level: Severity.Error,
          message: e.toString(),
          data: e.toJSON()
        }))
        return scope
      })
      throw new Error('Error while saving records')
    }

    const scholarRecord = result.records.find(r => r.recordType === Scholar.recordType)
    const yearInfoRecord = result.records.find(r => r.recordType === WWDCYearInfo.recordType)
    if (scholarRecord && yearInfoRecord) {
      commit('scholars/setCreatedScholarYearInfo', {
        scholar: Scholar.fromRecordReceived(scholarRecord),
        yearInfo: WWDCYearInfo.fromRecordReceived(yearInfoRecord)
      }, { root: true })
    }
  },
  async saveSocial({ commit }, { socialMedia, changes }: { socialMedia: ScholarSocialMedia; changes: RecordFields }) {
    const updatedSocial = ScholarSocialMedia.clone(socialMedia)
    updatedSocial.setFields(changes)
    await updatedSocial.save()
    commit('scholars/setScholarSocialMedia', {
      scholarRecordName: updatedSocial.scholar.recordName,
      socialMedia: updatedSocial
    }, { root: true })
  },

  async deleteYearInfo({ getters, commit }, yearInfo: WWDCYearInfo) {
    const scholar: Scholar = getters.scholar
    if (!scholar) return

    const yearToRemove = yearInfo.year.recordName
    const yearToRemoveIndex = scholar.wwdcYearInfos
      .findIndex(y => y.recordName === yearInfo.recordName)
    if (yearToRemoveIndex < 0) return

    const fieldsToUpdate: any = {
      wwdcYears: { value: arrayWithoutIndex(scholar.wwdcYears, yearToRemoveIndex) },
      wwdcYearInfos: { value: arrayWithoutIndex(scholar.wwdcYearInfos, yearToRemoveIndex) },
    }

    const approvedYearToRemoveIndex = scholar.wwdcYearsApproved
      .findIndex(y => y.recordName === yearToRemove)
    if (approvedYearToRemoveIndex > -1) {
      fieldsToUpdate['wwdcYearsApproved'] = { value: arrayWithoutIndex(scholar.wwdcYearsApproved, approvedYearToRemoveIndex) }
    }

    const updatedScholar = Scholar.clone(scholar)
    updatedScholar.setFields(fieldsToUpdate)

    await Promise.all([
      updatedScholar.save(),
      yearInfo.delete()
    ])

    commit('scholars/removeScholarYearInfo', {
      scholarRecordName: yearInfo.scholar.recordName,
      yearInfoRecordName: yearInfo.recordName,
      yearToRemoveIndex,
      approvedYearToRemoveIndex
    }, { root: true })
  },
  async requestDownload({ getters, commit }) {
    const scholar: Scholar = getters.scholar

    const createdRequest = await GDPRRequest.create({
      fields: {
        scholar: { value: { recordName: scholar.recordName!, action: CloudKit.ReferenceAction.DELETE_SELF }},
        type: { value: 'download' }
      }
    })

    commit(types.setDownloadRequest, createdRequest)
  },
  async deleteAccount({ getters, dispatch, rootState }) {
    const scholar: Scholar = getters.scholar

    await scholar.delete()

    if (rootState.auth.user) {
      const user = Users.clone(rootState.auth.user)
      user.scholar = undefined
      await user.save()
    }

    await dispatch('auth/signOut', null, { root: true })
  }
}

export const mutations: MutationTree<State> = {
  [types.setDownloadRequest](state, downloadRequest: GDPRRequest) {
    Vue.set(state, 'downloadRequest', downloadRequest)
  }
}
