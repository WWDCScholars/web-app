import { Middleware } from '@nuxt/types'

const authenticatedMiddleware: Middleware = async ({ store, redirect }): Promise<void> => {
  await store.state.auth.pendingPromise
  const isAuthenticated = store.getters['auth/isAuthenticated']
  if (!isAuthenticated) {
    redirect('/join')
  }
}

export default authenticatedMiddleware
