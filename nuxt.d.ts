import { CKConnection } from '@wwdcscholars/cloudkit'

declare module 'vue/types/vue' {
  interface Vue {
    $ck: CKConnection
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $ck: CKConnection
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $ck: CKConnection
  }
}
