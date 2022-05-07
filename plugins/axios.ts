import { Plugin } from '@nuxt/types'

const axiosPlugin: Plugin = ({ $config, $axios }, inject) => {
  // default axios instance for netlify forms
  $axios.setHeader('content-type', 'application/x-www-form-urlencoded')
}

export default axiosPlugin
