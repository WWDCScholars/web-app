import { Plugin } from '@nuxt/types'
import globals from '~/globals.json'
import get from 'lodash.get'

declare module 'vue/types/vue' {
  interface Vue {
    $g(key: string): any
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $g(key: string): any
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $g(key: string): any
  }
}

function accessGlobal(key: string): any {
  const value = get(globals, key)
  if (!value) {
    throw new Error(`Globals '${key}' is empty`)
  }
  return value
}

const GlobalsPlugin: Plugin = (context, inject) => {
  inject('g', accessGlobal)
}

export default GlobalsPlugin
