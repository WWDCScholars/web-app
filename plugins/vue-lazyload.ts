import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  loading: '/logo_loading.png',
  // error: '/loading-error.svg',
  attempt: 1
})
