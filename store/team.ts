import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { TeamMember, CloudKit } from '@wwdcscholars/cloudkit'

export const name = 'team'

export const types = {
  insertMember: 'insertMember'
}

export interface State {
  members: { [recordName: string]: TeamMember }
}

export const state = (): State => ({
  members: {}
})

export const getters: GetterTree<State, State> = {
  allMembers(state: State): TeamMember[] {
    return Object.values(state.members)
  }
}

export const actions: ActionTree<State, State> = {
  async queryMembers({ commit }): Promise<void> {
    const query: CloudKit.QueryBase = {
      filterBy: [{
        fieldName: 'isActive',
        comparator: CloudKit.QueryFilterComparator.EQUALS,
        fieldValue: { value: 1 }
      }],
      sortBy: [{ fieldName: 'name' }]
    }

    const result = await TeamMember.query(query)
    result.forEach(member => commit(types.insertMember, member))
  }
}

export const mutations: MutationTree<State> = {
  [types.insertMember](state: State, member: TeamMember) {
    Vue.set(state.members, member.recordName!, member)
  }
}
