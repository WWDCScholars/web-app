import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { WWDCYear, CloudKit } from '@wwdcscholars/cloudkit'

export const name = 'years'

export interface State {
  years: { [recordName: string]: WWDCYear }
}

export const state = (): State => ({
  years: {}
})

export const getters: GetterTree<State, State> = {
  byRecordName: (state) => (recordName: string): WWDCYear | undefined => {
    return state.years[recordName]
  },
  sortedKeys: (state): string[] => {
    return Object.keys(state.years).sort()
  }
}

export const actions: ActionTree<State, State> = {
  async fetchYear({ state, commit }, recordName: string): Promise<void> {
    // return if already loaded
    if (state.years.hasOwnProperty(recordName)) return

    const year = await WWDCYear.fetch(recordName)
    commit('insertYear', year)
  },
  async queryYears({ commit }): Promise<void> {
    const query: CloudKit.QueryBase = {
      filterBy: [],
      sortBy: [{ fieldName: 'year' }]
    }

    const result = await WWDCYear.query(query)
    result.forEach(year => commit('insertYear', year))
  }
}

export const mutations: MutationTree<State> = {
  insertYear(state: State, year: WWDCYear) {
    Vue.set(state.years, year.recordName, year)
  }
}
