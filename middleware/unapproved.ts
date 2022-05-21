import { Middleware } from '@nuxt/types'
import { Scholar } from '@wwdcscholars/cloudkit'

/**
 * Middleware that enforces having at least one unapproved
 * submission. Else, redirects to `/profile/submissions`.
 * @param context The Nuxt context.
 */
const unapprovedMiddleware: Middleware = async ({ store, redirect }): Promise<void> => {
  await store.state.auth.pendingPromise

  await store.dispatch('profile/loadScholar')
  const scholar: Scholar = store.getters['profile/scholar']
  const hasUnapprovedYear = scholar
    && (scholar.wwdcYearInfos?.length ?? 0) !== (scholar.wwdcYearsApproved?.length ?? 0)

  if (!hasUnapprovedYear) {
    redirect('/profile/submissions')
  }
}

export default unapprovedMiddleware
