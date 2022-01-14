import Vue from 'vue'
import { MutationTree } from 'vuex'

export const name = 'mobile-menu'

export const types = {
  setOpen: 'setOpen'
}

export interface State {
  isOpen: boolean
}

export const state = (): State => ({
  isOpen: false
})

export const mutations:  MutationTree<State> = {
  [types.setOpen](state, payload: boolean) {
    Vue.set(state, 'isOpen', payload)
  }
}
