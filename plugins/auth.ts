import { Plugin } from '@nuxt/types'
import { CloudKit } from '@wwdcscholars/cloudkit'

const authPlugin: Plugin = async ({ app, route, store, redirect }) => {
  app.$ck.on('authenticated', (userIdentity: CloudKit.UserIdentity) => {
    // console.log('[CloudKit] Authenticated', userIdentity)
  })

  app.$ck.on('unauthenticated', (container: CloudKit.Container) => {
    // console.log('[CloudKit] Unauthenticated')
    store.dispatch('auth/onUnauthenticated', container)
  })

  // If the ckSession query parameter is set, we returned from idmsa
  if (route.name === 'index' && 'ckSession' in route.query) {
    const container = app.$ck.defaultContainer
    container['_auth']._setSession(route.query.ckSession)

    store.state.auth.pendingPromise
      .then(() => {
        const isAuthenticated = store.getters['auth/isAuthenticated']
        if (isAuthenticated) {
          redirect('/profile')
        } else {
          redirect('/signin')
        }
      })
  }

  // this checks if there is a valid session, and if
  // - true: triggers an authenticated event
  // - false: triggers an unauthenticated
  app.$ck.setUpAuth()
    .then(authResult => {
      if (authResult) {
        store.dispatch('auth/onAuthenticated', authResult)
      }
    })
}

export default authPlugin
