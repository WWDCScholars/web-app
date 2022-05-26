import { Plugin } from '@nuxt/types'
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

function injectMapKit(): Promise<typeof mapkit> {
  if (globalInjectPromise) return globalInjectPromise

  globalInjectPromise = new Promise<typeof mapkit>(resolve => {
    globalInjectResolve = resolve
  })

  const script = document.createElement('script')
  script.onload = () => globalInjectResolve(window.mapkit)
  script.onerror = error => { throw new Error(error as string) }
  document.body.appendChild(script)
  script.src = MAPKIT_SRC

  return globalInjectPromise
}

let initialized: boolean = false
async function initializeMapKit(options: mapkit.MapKitInitOptions): Promise<typeof mapkit> {
  const mapkit = await injectMapKit()

  if (!initialized) {
    mapkit.init({
      ...mapOptions,
      ...options
    })
    initialized = true
  }

  return mapkit
}

const mapKitPlugin: Plugin = ({ $config }) => {
  Vue.prototype.$loadMapKit = async () => {
    await initializeMapKit({
      authorizationCallback(done) {
        done($config.mapKitJwt)
      },
      language: 'en-US'
    })
  }
}

export default mapKitPlugin
