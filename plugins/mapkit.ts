import { Plugin } from '@nuxt/types'
import type * as Sentry from '@sentry/minimal'
import Vue from 'vue'

const MAPKIT_VERSION = '5.65.x'
const MAPKIT_SRC = `https://cdn.apple-mapkit.com/mk/${MAPKIT_VERSION}/mapkit.js`

declare module 'vue/types/vue' {
  interface Vue {
    $loadMapKit: () => Promise<void>
  }
}

const mapOptions: mapkit.MapKitInitOptions = {
  authorizationCallback(done) {
    throw new Error('authorizationCallback not implemented')
  }
}

let globalInjectResolve: (instance: typeof mapkit) => void
let globalInjectPromise: Promise<typeof mapkit> | undefined

function injectMapKit(sentry: typeof Sentry): Promise<typeof mapkit> {
  if (globalInjectPromise) return globalInjectPromise

  globalInjectPromise = new Promise<typeof mapkit>(resolve => {
    globalInjectResolve = resolve
  })

  const script = document.createElement('script')
  script.onload = () => globalInjectResolve(window.mapkit)
  script.onerror = error => {
    sentry.captureException(error)
  }
  document.body.appendChild(script)
  script.src = MAPKIT_SRC

  return globalInjectPromise
}

let initialized: boolean = false
async function initializeMapKit(options: mapkit.MapKitInitOptions, sentry: typeof Sentry): Promise<typeof mapkit> {
  const mapkit = await injectMapKit(sentry)

  if (!initialized) {
    mapkit.init({
      ...mapOptions,
      ...options
    })
    initialized = true
  }

  return mapkit
}

const mapKitPlugin: Plugin = ({ $config, $sentry }) => {
  Vue.prototype.$loadMapKit = async () => {
    await initializeMapKit({
      authorizationCallback(done) {
        done($config.mapKitJwt)
      },
      language: 'en-US'
    }, $sentry)
  }
}

export default mapKitPlugin
