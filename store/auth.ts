import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { Users, Scholar, CloudKit, ck } from '@wwdcscholars/cloudkit'

export const name = 'auth'

export interface State {
  userIdentity?: CloudKit.UserIdentity,
  userScholarReference?: CloudKit.Reference

  signInURL?: string
}

export const state = (): State => ({
  userIdentity: undefined,
  userScholarReference: undefined,

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
    console.log('fetched user', user)
    let scholar: Scholar | undefined

    // fetch Scholar if it exists
    if (user.scholar) {
      commit('setUserScholarReference', user.scholar)
      scholar = await Scholar.fetch(user.scholar.recordName)
    }
    console.log('fetched scholar', scholar)

    if (scholar) {
      commit('scholars/insertScholar', scholar, { root: true })
    } else {
      // create a new one and update the user
      // redirect to signup
    }

    commit('setUserIdentity', userIdentity)
  },
  async onUnauthenticated({ commit }, container: CloudKit.Container): Promise<void> {
    const auth = container['_auth']
    commit('setUserIdentity', undefined)
    commit('setUserScholarReference', undefined)
    commit('setSignInURL', auth._signInURL)
  },
  async signOut(): Promise<void> {
    ck.signOut()
  }
}

export const mutations: MutationTree<State> = {
  setUserIdentity(state: State, userIdentity?: CloudKit.UserIdentity) {
    state.userIdentity = userIdentity
  },
  setUserScholarReference(state: State, userScholarReference?: CloudKit.Reference) {
    state.userScholarReference = userScholarReference
  },
  setSignInURL(state, url: string) {
    state.signInURL = url
  }
}
