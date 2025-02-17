import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import {
  Scholar,
  ScholarPrivate,
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

export const types = {
  insertScholar: 'insertScholar',
  setScholarPrivate: 'setScholarPrivate',
  setScholarYearInfo: 'setScholarYearInfo',
  setCreatedScholarYearInfo: 'setCreatedScholarYearInfo',
  setScholarSocialMedia: 'setScholarSocialMedia',
  setScholarAge: 'setScholarAge',
  removeScholarYearInfo: 'removeScholarYearInfo'
}

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
  async queryScholars({ state, commit }, year: WWDCYear): Promise<void> {
    if (!year) return
    const query: CloudKit.QueryBase = {
      filterBy: [{
        fieldName: 'wwdcYearsApproved',
        comparator: CloudKit.QueryFilterComparator.LIST_CONTAINS,
        fieldValue: { value: { recordName: year.recordName! } }
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
    const existingScholars = new Set(Object.keys(state.scholars))
    result
      .filter(scholar => !existingScholars.has(scholar.recordName!))
      .forEach(scholar => commit(types.insertScholar, scholar))
  },
  async loadPrivateIfMissing({ state, dispatch }, { scholarRecordName, privateRecordName }) {
    if (!state.scholars[scholarRecordName]) throw new Error('CloudKit: Scholar for private record does not exist.')
    const scholar = state.scholars[scholarRecordName]

    if (!isEmpty(scholar.loadedPrivate)) return

    await dispatch('upgradeScholarWithPrivate', privateRecordName)
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
  async loadAgeIfMissing({ state, dispatch }, scholarRecordName) {
    if (!state.scholars[scholarRecordName]) throw new Error('CloudKit: Scholar for age does not exist.')
    const scholar = state.scholars[scholarRecordName]

    // Use the scholar's birthday property is their age

    if (!scholar.scholarPrivate) return
    if (!!scholar.birthday) return

    await dispatch('upgradeScholarWithAge', {
      scholarRecordName,
      scholarPrivateRecordName: scholar.scholarPrivate.recordName
    })
  },
  async upgradeScholarWithPrivate({ commit }, recordName: string) {
    const scholarPrivate = await ScholarPrivate.fetch(recordName)
    const scholarRecordName = scholarPrivate.scholar.recordName
    commit(types.setScholarPrivate, { scholarRecordName, scholarPrivate })
  },
  async upgradeScholarWithYearInfo({ commit }, recordName: string) {
    const yearInfo = await WWDCYearInfo.fetch(recordName)
    const scholarRecordName = yearInfo.scholar.recordName
    commit(types.setScholarYearInfo, { scholarRecordName, yearInfo })
  },
  async upgradeScholarWithSocialMedia({ commit }, recordName: string) {
    const socialMedia = await ScholarSocialMedia.fetch(recordName)
    const scholarRecordName = socialMedia.scholar.recordName
    commit(types.setScholarSocialMedia, { scholarRecordName, socialMedia })
  },
  async upgradeScholarWithAge({ commit }, { scholarRecordName, scholarPrivateRecordName }) {
    const baseURL = this.app.$config.netlifyFunctionsBaseURL ?? ''
    const { age } = await this.$axios.$get(`${baseURL}/api/scholar-age`, {
      params: { r: scholarPrivateRecordName }
    })
    commit(types.setScholarAge, { scholarRecordName, age })
  }
}

export const mutations: MutationTree<State> = {
  [types.insertScholar](state: State, scholar: Scholar) {
     // make sure the birthday property exists so reactivity works when its loaded later
    scholar.birthday = undefined
    Vue.set(state.scholars, scholar.recordName!, scholar)
  },
  [types.setScholarPrivate](state: State, p: { scholarRecordName: string; scholarPrivate: ScholarPrivate }) {
    if (!state.scholars[p.scholarRecordName]) return

    Vue.set(
      state.scholars[p.scholarRecordName],
      'loadedPrivate',
      p.scholarPrivate
    )
  },
  [types.setScholarYearInfo](state: State,  { scholarRecordName, yearInfo}: { scholarRecordName: string; yearInfo: WWDCYearInfo }) {
    if (!state.scholars[scholarRecordName]) return

    Vue.set(
      state.scholars[scholarRecordName].loadedYearInfos,
      yearInfo.year.recordName,
      yearInfo
    )
  },
  [types.setCreatedScholarYearInfo]({ scholars }, { scholar, yearInfo }: { scholar: Scholar, yearInfo: WWDCYearInfo }) {
    if (!scholars[scholar.recordName!]) return

    Vue.set(
      scholars[scholar.recordName!],
      'wwdcYearInfos',
      scholar.wwdcYearInfos
    )
    Vue.set(
      scholars[scholar.recordName!],
      'wwdcYears',
      scholar.wwdcYears
    )
    Vue.set(
      scholars[scholar.recordName!],
      'wwdcYearsApproved',
      scholar.wwdcYearsApproved
    )
    Vue.set(
      scholars[scholar.recordName!].loadedYearInfos,
      yearInfo.year.recordName,
      yearInfo
    )
  },
  [types.removeScholarYearInfo](state: State, p: { scholarRecordName: string; yearInfoRecordName: string, yearToRemoveIndex: number; approvedYearToRemoveIndex: number }) {
    if (!state.scholars[p.scholarRecordName]) return

    // remove loaded year info
    Vue.delete(
      state.scholars[p.scholarRecordName].loadedYearInfos,
      p.yearInfoRecordName
    )

    // remove in scholar wwdcYears, wwdcYearsApproved and wwdcYearInfos
    if (p.yearToRemoveIndex > -1) {
      Vue.delete(
        state.scholars[p.scholarRecordName].wwdcYears,
        p.yearToRemoveIndex
      )
      Vue.delete(
        state.scholars[p.scholarRecordName].wwdcYearInfos,
        p.yearToRemoveIndex
      )
    }

    if (p.approvedYearToRemoveIndex > -1) {
      Vue.delete(
        state.scholars[p.scholarRecordName].wwdcYearsApproved,
        p.approvedYearToRemoveIndex
      )
    }
  },
  [types.setScholarSocialMedia](state: State, p: { scholarRecordName: string, socialMedia: ScholarSocialMedia }) {
    if (!state.scholars[p.scholarRecordName]) return

    Vue.set(
      state.scholars[p.scholarRecordName],
      'loadedSocialMedia',
      p.socialMedia
    )
  },
  [types.setScholarAge](state: State, p: { scholarRecordName: string, age: number }) {
    if (!state.scholars[p.scholarRecordName]) return

    Vue.set(
      state.scholars[p.scholarRecordName],
      'birthday',
      p.age
    )
  }
}
