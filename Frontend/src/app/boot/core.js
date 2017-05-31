import { Vue, Raven } from './vue'
import store from './../store'
import Router from './router'
import VueAnalytics from 'vue-analytics'
const router = Router(store.auth)

Vue.use(VueAnalytics, {
  id: 'UA-100224219-1',
  router
})

require('./libraries')

store.auth.router = router
store.auth.Raven = Raven

export { Vue, router, store, Raven }
