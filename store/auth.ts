import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { Users, CloudKit, connection } from '@wwdcscholars/cloudkit'

export const name = 'auth'

export const types = {
  setUserIdentity: 'setUserIdentity',
  setUser: 'setUser',
  setUserScholarReference: 'setUserScholarReference',
  donePending: 'donePending'
}

let pendingPromiseResolve: () => void

export interface State {
  pendingPromise: Promise<void>
  isPending: boolean
  userIdentity?: CloudKit.UserIdentity
  user?: Users
  userScholarReference?: CloudKit.Reference
}

export const state = (): State => ({
  pendingPromise: new Promise((resolve) => pendingPromiseResolve = resolve),
  isPending: true,
  userIdentity: undefined,
  userScholarReference: undefined,
  user: undefined
})

export const getters: GetterTree<State, State> = {
  isAuthenticated(state): boolean {
    return !!state.userIdentity
  },
  hasScholarReference(state): boolean {
    return !!state.userScholarReference
  }
}

export const actions: ActionTree<State, State> = {
  async onAuthenticated({ commit }, userIdentity: CloudKit.UserIdentity): Promise<void> {
    const user = await Users.fetch(userIdentity.userRecordName)
    commit(types.setUser, user)
    commit(types.setUserScholarReference, user.scholar)
    commit(types.setUserIdentity, userIdentity)
    commit(types.donePending)
  },
  async onUnauthenticated({ commit }, container: CloudKit.Container): Promise<void> {
    commit(types.setUserIdentity, undefined)
    commit(types.setUser, undefined)
    commit(types.setUserScholarReference, undefined)
    commit(types.donePending)
  },
  async signOut(): Promise<void> {
    await connection.signOut()
  },
  getSignInURL(): string | undefined {
    return this.$ck.defaultAuth._signInURL
  },
  async fetchUser({ state, commit }): Promise<void> {
    if (!state.userIdentity) return
    const user = await Users.fetch(state.userIdentity.userRecordName)
    commit(types.setUser, user)
    commit(types.setUserScholarReference, user.scholar)
  }
}

export const mutations: MutationTree<State> = {
  [types.setUserIdentity](state: State, userIdentity?: CloudKit.UserIdentity) {
    Vue.set(state, 'userIdentity', userIdentity)
  },
  [types.setUser](state: State, user: Users) {
    Vue.set(state, 'user', user)
  },
  [types.setUserScholarReference](state: State, userScholarReference?: CloudKit.Reference) {
    Vue.set(state, 'userScholarReference', userScholarReference)
  },
  [types.donePending](state) {
    Vue.set(state, 'isPending', false)
    pendingPromiseResolve()
  }
}
