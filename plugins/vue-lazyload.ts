import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  loading: '/loading-spinner.svg',
  // error: '/loading-error.svg',
  attempt: 2
})
