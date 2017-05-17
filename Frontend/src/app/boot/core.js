import { Vue, Raven } from './vue'
import store from './../store'
import Router from './router'
const router = Router(store.auth)

require('./libraries')

store.auth.router = router
store.auth.Raven = Raven

export { Vue, router, store, Raven }
