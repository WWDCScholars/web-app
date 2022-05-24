import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import dayjs from 'dayjs'
import { Severity } from '@sentry/types'
import { RootState } from '~/store'
import {
  CloudKit,
  RecordFields,
  Scholar,
  ScholarPrivate,
  ScholarSocialMedia,
  Users,
  WWDCYearInfo
} from '@wwdcscholars/cloudkit'
import { v4 as uuid } from 'uuid'
import { objectMap } from '~/util/object'
import { resizeImage } from '~/util/image'

function wrapEntriesInRecordField(object: { [key: string]: any }): RecordFields {
  return objectMap(object, value => ({ value }), true)
}

export const name = 'join'

export const types = {
  updateFields: 'updateFields'
}

export interface State {
  profile?: {
    profilePicture: File
    givenName: string
    familyName: string
    email: string
    birthday: number
    gender: ('male' | 'female' | 'other')
    location: CloudKit.Location,
    biography: string
  }
  social?: {
    twitter?: string
    github?: string
    discord?: string
    linkedin?: string
    imessage?: string
    facebook?: string
    website?: string
  }
  submission?: {
    year: string
    appliedAs: ('student' | 'stem' | 'academy')
    description: string
    screenshots: File[]
    videoLink?: string
    githubLink?: string
    appstoreLink?: string
    acceptanceEmail: File
  }
  complete: {
    profile: boolean
    social: boolean
    submission: boolean
  }
}

export const state = (): State => ({
  profile: undefined,
  social: undefined,
  submission: undefined,
  complete: {
    profile: false,
    social: false,
    submission: false
  }
})

export const getters: GetterTree<State, RootState> = {
  birthday(state): number | string | undefined {
    return state.profile?.birthday
  },
  isParentalConsentRequired(state, getters): boolean | undefined {
    if (!getters.birthday) {
      return undefined
    }

    let birthday: dayjs.Dayjs
    if (typeof getters.birthday === 'string') {
      birthday = dayjs(getters.birthday, 'YYYY-MM-DD')
    } else {
      birthday = dayjs(getters.birthday)
    }

    const age = dayjs().diff(birthday, 'year')
    return age < 18
  },
  isFormComplete(state): boolean {
    return state.complete.profile && state.complete.social && state.complete.submission
  }
}

export const actions: ActionTree<State, RootState> = {
  async linkRequest({ rootState }, email: string): Promise<void> {
    const userRecordName = rootState.auth.userIdentity?.userRecordName
    if (!userRecordName) return

    await this.$linkAPI.post('/request', {
      email,
      userRecordName
    })
  },
  async submitForm({ state, rootState, commit, dispatch }): Promise<void> {
    if (!state.profile || !state.social || !state.submission) {
      throw new Error('Required field is missing a value')
    }
    if (!rootState.auth.user) {
      throw new Error('User record is missing')
    }
    if (!!rootState.auth.user.scholar) {
      throw new Error('User already has an associated Scholar')
    }

    // record names to cross-reference between records
    const scholarRecordName = uuid().toUpperCase()
    const scholarPrivateRecordName = uuid().toUpperCase()
    const scholarSocialMediaRecordName = uuid().toUpperCase()
    const yearInfoRecordName = uuid().toUpperCase()

    // Create Scholar record
    const scholarFields: RecordFields = {
      ...wrapEntriesInRecordField(state.profile),
      scholarPrivate: { value: {
        recordName: scholarPrivateRecordName,
        action: CloudKit.ReferenceAction.DELETE_SELF
      }},
      socialMedia: { value: {
        recordName: scholarSocialMediaRecordName,
        action: CloudKit.ReferenceAction.DELETE_SELF
      }},
      wwdcYearInfos: { value: [
        { recordName: yearInfoRecordName, action: CloudKit.ReferenceAction.NONE }
      ]} as any, // wrong type in tsl-apple-cloudkit
      wwdcYears: { value: [
        { recordName: state.submission.year!, action: CloudKit.ReferenceAction.NONE }
      ]} as any, // wrong type in tsl-apple-cloudkit
      gdprConsentAt: { value: new Date().getTime() }
    }
    delete scholarFields['email'] // only in ScholarPrivate
    if (state.profile.profilePicture instanceof File) {
      const result = await resizeImage(state.profile.profilePicture, this.$g('profile.picture.maxSize'))
      scholarFields.profilePicture = { value: result }
    }
    const scholar = new Scholar()
    scholar.recordName = scholarRecordName
    scholar.setFields(scholarFields)

    // Create ScholarPrivate record
    const scholarPrivate = new ScholarPrivate()
    scholarPrivate.recordName = scholarPrivateRecordName
    scholarPrivate.email = state.profile.email
    scholarPrivate.birthday = state.profile.birthday
    scholarPrivate.scholar = {
      recordName: scholarRecordName,
      action: CloudKit.ReferenceAction.DELETE_SELF
    }

    // Create ScholarSocialMedia record
    const scholarSocialMedia = new ScholarSocialMedia()
    scholarSocialMedia.recordName = scholarSocialMediaRecordName
    scholarSocialMedia.setFields(
      wrapEntriesInRecordField(state.social)
    )
    scholarSocialMedia.scholar = {
      recordName: scholarRecordName,
      action: CloudKit.ReferenceAction.DELETE_SELF
    }

    // Create WWDCYearInfo record
    const yearInfoFields: RecordFields = {
      ...wrapEntriesInRecordField(state.submission),
      scholar: { value: {
        recordName: scholarRecordName,
        action: CloudKit.ReferenceAction.DELETE_SELF
      }},
      year: { value: {
        recordName: state.submission.year,
        action: CloudKit.ReferenceAction.NONE
      }},
      status: { value: 'pending' },
      screenshots: {
        value: (await Promise.all(
          state.submission.screenshots
            .map(async screenshot => {
              return resizeImage(screenshot, this.$g('submission.screenshot.maxSize'))
            })
        )) as any // wrong type in tsl-apple-cloudkit
      },
      acceptanceEmail: {
        value: await resizeImage(state.submission.acceptanceEmail, this.$g('submission.acceptanceEmail.maxSize'))
      }
    }
    const yearInfo = new WWDCYearInfo()
    yearInfo.recordName = yearInfoRecordName
    yearInfo.setFields(yearInfoFields)

    // Set Scholar reference on User
    const user = Users.clone(rootState.auth.user)
    user.scholar = {
      recordName: scholarRecordName,
      action: CloudKit.ReferenceAction.NONE
    }

    // Clear form state
    commit(types.updateFields, {
      section: 'profile',
      value: undefined,
      isValid: false
    })
    commit(types.updateFields, {
      section: 'social',
      value: undefined,
      isValid: false
    })
    commit(types.updateFields, {
      section: 'submission',
      value: undefined,
      isValid: false
    })

    const batch = this.$ck.newRecordsBatchInPublicDatabase()
      .create([
        scholar.recordToSave,
        scholarPrivate.recordToSave,
        scholarSocialMedia.recordToSave,
        yearInfo.recordToSave
      ])
      .update([user.recordToSave as CloudKit.RecordToSave])

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

    const userRecord = result.records.find(r => r.recordType === Users.recordType)
    if (userRecord) {
      const resultUser = Users.fromRecordReceived(userRecord)
      commit('auth/setUser', resultUser, { root: true })
      commit('auth/setUserScholarReference', resultUser.scholar, { root: true })
    } else {
      await dispatch('auth/fetchUser', undefined, { root: true })
    }
  }
}

export const mutations: MutationTree<State> = {
  [types.updateFields](state, { section, value, isValid }: { section: string, value: any, isValid: boolean }) {
    Vue.set(state, section, value)
    Vue.set(state.complete, section, isValid)
  }
}
