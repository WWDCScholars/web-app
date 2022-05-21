import { Middleware } from '@nuxt/types'

/**
 * Middleware that permits anonymous access, but redirects when
 * authenticated in one of the following ways:
 * - when user has a profile, redirect to `/profile`,
 * - when user has no profile, redirect to `/join`.
 *
 * Having a profile means the `scholar` reference on the `Users`
 * object is set.
 * @param context The Nuxt context.
 */
const anonymousOrProfileMiddleware: Middleware = async ({ store, redirect }): Promise<void> => {
  await store.state.auth.pendingPromise
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const hasScholarReference = store.getters['auth/hasScholarReference']
  if (isAuthenticated && hasScholarReference) {
    redirect('/profile')
  } else if (isAuthenticated && !hasScholarReference) {
    redirect('/join/signup')
  }
}

export default anonymousOrProfileMiddleware
