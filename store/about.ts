import Vue from 'vue'
import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState } from '~/store'
import {
  TeamMember,
  FAQItem,
  CloudKit
} from '@wwdcscholars/cloudkit'

export const name = 'about'

export const types = {
  setTeamMembers: 'setTeamMembers',
  setFAQItems: 'setFAQItems'
}

export interface State {
  teamMembers: TeamMember[]
  faqItems: FAQItem[]
}

export const state = (): State => ({
  teamMembers: [],
  faqItems: []
})

export const getters: GetterTree<State, RootState> = {}

export const actions: ActionTree<State, RootState> = {
  async queryTeamMembers({ commit }): Promise<void> {
    const teamMembers = await TeamMember.query({
      filterBy: [{
        fieldName: 'isActive',
        comparator: CloudKit.QueryFilterComparator.EQUALS,
        fieldValue: { value: 1 }
      }],
      sortBy: [{ fieldName: 'name' }]
    })
    commit(types.setTeamMembers, teamMembers)
  },
  async queryFAQItems({ commit }): Promise<void> {
    const faqItems = await FAQItem.query({
      sortBy: [{ fieldName: 'index' }]
    })
    commit(types.setFAQItems, faqItems)
  }
}

export const mutations: MutationTree<State> = {
  [types.setTeamMembers](state: State, teamMembers: TeamMember[]) {
    Vue.set(state, 'teamMembers', [...teamMembers])
  },
  [types.setFAQItems](state: State, faqItems: FAQItem[]) {
    Vue.set(state, 'faqItems', [...faqItems])
  }
}
