import { Middleware } from '@nuxt/types'

const authenticatedMiddleware: Middleware = ({ store, redirect }) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  if (!isAuthenticated) {
    redirect('/signin')
  }
}

export default authenticatedMiddleware
