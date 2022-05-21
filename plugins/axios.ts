import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

const axiosPlugin: Plugin = ({ $config, $axios }, inject) => {
  // second axios instance for link api
  const linkAPI = $axios.create()
  linkAPI.setBaseURL($config.linkApiBaseURL)
  linkAPI.setToken($config.linkApiToken, 'Bearer')
  inject('linkAPI', linkAPI)

  // default axios instance for netlify forms
  $axios.setHeader('content-type', 'application/x-www-form-urlencoded')
}

declare module 'vue/types/vue' {
  interface Vue {
    $linkAPI: NuxtAxiosInstance
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $linkAPI: NuxtAxiosInstance
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $linkAPI: NuxtAxiosInstance
  }
}

export default axiosPlugin
