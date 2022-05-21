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
  sortedKeys(state): string[] {
    return Object.keys(state.years).sort()
  },
  latestYear(state): WWDCYear | undefined {
    const sortedKeys = Object.keys(state.years).sort()
    if (!sortedKeys.length) {
      return undefined
    }

    const lastYearKey = sortedKeys[sortedKeys.length - 1]
    return state.years[lastYearKey]
  },
  visibleYears(state): { [recordName: string]: WWDCYear } {
    return Object.fromEntries(
      Object.entries(state.years)
        .filter(([recordName, year]) => !year.isHidden)
    )
  },
  sortedVisibleKeys(state, getters): string[] {
    return Object.keys(getters.visibleYears).sort()
  },
  latestVisibleYear(state, getters): WWDCYear | undefined {
    const sortedKeys = getters.sortedVisibleKeys
    if (!sortedKeys.length) {
      return undefined
    }

    const lastYearKey = sortedKeys[sortedKeys.length - 1]
    return state.years[lastYearKey]
  }
}

export const actions: ActionTree<State, State> = {
  async fetchYear({ state, commit }, recordName: string): Promise<void> {
    // return if already loaded
    if (state.years.hasOwnProperty(recordName)) return

    const year = await WWDCYear.fetch(recordName)
    commit('insertYear', year)
  },
  async queryYears({ commit }, includeHidden: boolean = false): Promise<void> {
    const filterBy: CloudKit.RecordFieldFilter[] = []
    if (!includeHidden) {
      filterBy.push({
        fieldName: 'isHidden',
        comparator: CloudKit.QueryFilterComparator.EQUALS,
        fieldValue: { value: 0 }
      })
    }
    const query: CloudKit.QueryBase = {
      filterBy,
      sortBy: [{ fieldName: 'year' }]
    }

    const result = await WWDCYear.query(query)
    result.forEach(year => commit('insertYear', year))
  }
}

export const mutations: MutationTree<State> = {
  insertYear(state: State, year: WWDCYear) {
    Vue.set(state.years, year.recordName!, year)
  }
}
