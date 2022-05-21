import { Middleware } from '@nuxt/types'

/**
 * Middleware that enforces having a profile,
 * i.e. having the `scholar` reference set on the `Users` object.
 * @param context The Nuxt context.
 */
const profileMiddleware: Middleware = async ({ store, redirect }): Promise<void> => {
  await store.state.auth.pendingPromise
  const hasScholarReference = store.getters['auth/hasScholarReference']
  if (!hasScholarReference) {
    redirect('/join/signup')
  }
}

export default profileMiddleware
