import { Router } from './vue'
import routes from './../routes'

export default (auth) => {
  const router = new Router({
    mode: 'hash',
    // mode: 'history', // use html5 history features
    // hashbang: false, // remove the hashbang from the url
    routes
  })

  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !auth.user.isAuthenticated) {
      // if route requires auth and user is not authenticated
      next({ path: '/signin' })
    } else if (to.meta.requiresAnonymous && auth.user.authenticated) {
      next({ path: '/' })
    } else {
      next()
    }
  })

  return router
}
