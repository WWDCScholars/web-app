import { Middleware } from '@nuxt/types'

const authenticatedMiddleware: Middleware = ({ store, redirect }) => {
  store.state.auth.pending
    .then(() => {
      const isAuthenticated = store.getters['auth/isAuthenticated']
      if (isAuthenticated) {
        redirect('/')
      }
    })
}

export default authenticatedMiddleware
