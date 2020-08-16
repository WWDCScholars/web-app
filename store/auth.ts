import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { Users, Scholar, CloudKit, ck } from '@wwdcscholars/cloudkit'

export const name = 'auth'

export const types = {
  setUserIdentity: 'setUserIdentity',
  setUser: 'setUser',
  setUserScholarReference: 'setUserScholarReference',
  setSignInURL: 'setSignInURL',
  donePending: 'donePending'
}

let pendingPromiseResolve: () => void

export interface State {
  pending: Promise<void>
  userIdentity?: CloudKit.UserIdentity
  user?: Users
  userScholarReference?: CloudKit.Reference

  signInURL?: string
}

export const state = (): State => ({
  pending: new Promise((resolve) => pendingPromiseResolve = resolve),
  userIdentity: undefined,
  userScholarReference: undefined,
  user: undefined,

  signInURL: undefined
})

export const getters: GetterTree<State, State> = {
  isAuthenticated(state: State): boolean {
    return !!state.userIdentity
  }
}

export const actions: ActionTree<State, State> = {
  async onAuthenticated({ commit }, userIdentity: CloudKit.UserIdentity): Promise<void> {
    const user = await Users.fetch(userIdentity.userRecordName)
    commit(types.setUser, user)

    let scholar: Scholar | undefined

    // fetch Scholar if it exists
    if (user.scholar) {
      commit(types.setUserScholarReference, user.scholar)
      scholar = await Scholar.fetch(user.scholar.recordName)
    }

    if (scholar) {
      commit('scholars/insertScholar', scholar, { root: true })
    } else {
      // create a new one and update the user
      // redirect to signup
    }

    commit(types.setUserIdentity, userIdentity)
    commit(types.donePending)
  },
  async onUnauthenticated({ commit }, container: CloudKit.Container): Promise<void> {
    const auth = container['_auth']
    commit(types.setUserIdentity, undefined)
    commit(types.setUser, undefined)
    commit(types.setUserScholarReference, undefined)
    commit(types.setSignInURL, auth._signInURL)
    commit(types.donePending)
  },
  async signOut(): Promise<void> {
    ck.signOut()
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
  [types.setSignInURL](state, url: string) {
    Vue.set(state, 'signInURL', url)
  },
  [types.donePending]() {
    pendingPromiseResolve()
  }
}
