import { Plugin } from '@nuxt/types'
import { CloudKit } from '@wwdcscholars/cloudkit'

const authPlugin: Plugin = async ({ app, route, store }) => {
  app.$ck.on('authenticated', (userIdentity: CloudKit.UserIdentity) => {
    console.log('[CloudKit] Authenticated', userIdentity)
    // store
  })

  app.$ck.on('unauthenticated', (container: CloudKit.Container) => {
    console.log('[CloudKit] Unauthenticated')
    store.dispatch('auth/onUnauthenticated', container)
  })

  // If the ckSession query parameter is set, we returned from idmsa
  route.query
  if (route.name === 'index' && 'ckSession' in route.query) {
    const container = app.$ck.defaultContainer
    container['_auth']._setSession(route.query.ckSession)
  }

  // this checks if there is a valid session, and if
  // - true: triggers an authenticated event
  // - false: triggers an unauthenticated
  const authResult = await app.$ck.setUpAuth() // TODO: Don't slow down page load?
  if (authResult) {
    await store.dispatch('auth/onAuthenticated', authResult)
  }
}

export default authPlugin
