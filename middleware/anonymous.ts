import { Middleware } from '@nuxt/types'

const authenticatedMiddleware: Middleware = ({ store, redirect }) => {
  store.state.auth.pendingPromise
    .then(() => {
      const isAuthenticated = store.getters['auth/isAuthenticated']
      if (isAuthenticated) {
        redirect('/')
      }
    })
}

export default authenticatedMiddleware
