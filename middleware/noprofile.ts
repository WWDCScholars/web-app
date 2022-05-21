import { Middleware } from '@nuxt/types'

/**
 * Middleware that enforces not having a profile,
 * i.e. not having the `scholar` reference set on the `Users` object.
 * @param context The Nuxt context.
 */
const noProfileMiddleware: Middleware = async ({ store, redirect }): Promise<void> => {
  await store.state.auth.pendingPromise
  const hasScholarReference = store.getters['auth/hasScholarReference']
  if (hasScholarReference) {
    redirect('/profile')
  }
}

export default noProfileMiddleware
