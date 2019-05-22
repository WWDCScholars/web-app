import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import {
  Scholar,
  ScholarSocialMedia,
  WWDCYearInfo,
  WWDCYear,
  CloudKit
} from '@wwdcscholars/cloudkit'

function isEmpty(obj: object | undefined): boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

export const name = 'scholars'

export interface State {
  scholars: { [recordName: string]: Scholar }
}

export const state = (): State => ({
  scholars: {}
})

export const getters: GetterTree<State, State> = {
  byRecordName: (state) => (recordName: string): Scholar => {
    return state.scholars[recordName]
  }
}

export const actions: ActionTree<State, State> = {
  async fetchScholar({ state, commit }, recordName: string): Promise<void> {
    // return if already loaded
    if (state.scholars.hasOwnProperty(recordName)) return

    const scholar = await Scholar.fetch(recordName)
    commit('insertScholar', scholar)
  },
  async queryScholars({ commit }, year: WWDCYear): Promise<void> {
    if (!year) return
    const query: CloudKit.QueryBase = {
      filterBy: [{
        fieldName: 'wwdcYearsApproved',
        comparator: CloudKit.QueryFilterComparator.LIST_CONTAINS,
        fieldValue: { value: { recordName: year.recordName } }
      }, {
        fieldName: 'gdprConsentAt',
        comparator: CloudKit.QueryFilterComparator.LESS_THAN,
        fieldValue: { value: new Date().getTime() }
      }],
      sortBy: [
        { fieldName: 'givenName' }
      ]
    }

    const result = await Scholar.query(query)
    result
      .forEach(scholar => commit('insertScholar', scholar))
  },
  async loadYearInfoIfMissing({ state, dispatch }, { scholarRecordName, yearInfoRecordName }) {
    if (!state.scholars[scholarRecordName]) throw new Error('CloudKit: Scholar for year info record does not exist.')
    const scholar = state.scholars[scholarRecordName]

    for (const [, yearInfo] of Object.entries(scholar.loadedYearInfos)) {
      if (yearInfo.recordName === yearInfoRecordName) {
        return // scholar already contains the year info record
      }
    }

    await dispatch('upgradeScholarWithYearInfo', yearInfoRecordName)
  },
  async loadSocialMediaIfMissing({ state, dispatch }, { scholarRecordName, socialMediaRecordName }) {
    if (!state.scholars[scholarRecordName]) throw new Error('CloudKit: Scholar for social media record does not exist.')
    const scholar = state.scholars[scholarRecordName]

    if (!isEmpty(scholar.loadedSocialMedia)) return

    await dispatch('upgradeScholarWithSocialMedia', socialMediaRecordName)
  },
  async upgradeScholarWithYearInfo({ commit }, recordName: string) {
    const yearInfo = await WWDCYearInfo.fetch(recordName)
    const scholarRecordName = yearInfo.scholar.recordName
    commit('setScholarYearInfo', { scholarRecordName, yearInfo })
  },
  async upgradeScholarWithSocialMedia({ commit }, recordName: string) {
    const socialMedia = await ScholarSocialMedia.fetch(recordName)
    const scholarRecordName = socialMedia.scholar.recordName
    commit('setScholarSocialMedia', { scholarRecordName, socialMedia })
  }
}

export const mutations: MutationTree<State> = {
  insertScholar(state: State, scholar: Scholar) {
    Vue.set(state.scholars, scholar.recordName, scholar)
  },
  setScholarYearInfo(state: State, p: { scholarRecordName: string; yearInfo: WWDCYearInfo}) {
    if (!state.scholars[p.scholarRecordName]) {
      return
    }

    Vue.set(
      state.scholars[p.scholarRecordName].loadedYearInfos,
      p.yearInfo.year.recordName,
      p.yearInfo
    )
  },
  setScholarSocialMedia(state: State, p: { scholarRecordName: string, socialMedia: ScholarSocialMedia }) {
    if (!state.scholars[p.scholarRecordName]) {
      return
    }

    Vue.set(
      state.scholars[p.scholarRecordName],
      'loadedSocialMedia',
      p.socialMedia
    )
  }
}
