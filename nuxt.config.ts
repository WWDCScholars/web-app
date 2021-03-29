import { NuxtConfig } from '@nuxt/types'
import { config as dotenv } from 'dotenv'

dotenv()

const version = require('./package.json').version
const isDevelopment = (process.env.NODE_ENV === 'development')
const isLocal = (process.env.LOCAL === '1')

let envPrefix: string
if (process.env.NODE_ENV === 'production') {
  envPrefix = 'PROD'
} else if (process.env.NODE_ENV === 'staging') {
  envPrefix = 'STAGE'
} else {
  envPrefix = 'DEV'
}

const config: NuxtConfig = {
  ssr: false,

  /*
   ** Headers of the page
   */
  head: {
    title: 'Welcome to WWDCScholars!',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Take a look at Apple WWDC Scholarship winners from all around the world as well as their winning submissions!'
      },
      { name: 'keywords', content: 'WWDCScholars,WWDC,Scholars,Apple' },
      { name: 'author', content: 'WWDCScholars' },
      { name: 'og:image', content: '/icons/fb-og-image.png' },
      { name: 'apple-itunes-app', content: 'app-id=1459158255' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icons/favicon.ico' },
      {
        rel: 'apple-touch-icon-precomposed',
        href: '/icons/favicon-180.png',
        sizes: '180x180'
      },
      {
        rel: 'apple-touch-icon-precomposed',
        href: '/icons/favicon-152.png',
        sizes: '152x152'
      },
      {
        rel: 'apple-touch-icon-precomposed',
        href: '/icons/favicon-120.png',
        sizes: '120x120'
      }
    ],
  },

  /*
   ** Runtime configuration
   */

  publicRuntimeConfig: {
    mapKitJwt: process.env[`${envPrefix}_MAPKIT_JWT`],
    colors: {
      purple: 'rgb(65, 53, 153)'
    }
  },
  privateRuntimeConfig: {},

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'rgb(65, 53, 153)',
    failedColor: '#D83946'
  },

  /*
   ** Global CSS
   */
  css: ['~assets/sass/app/_index.sass'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/globals',
    '~/plugins/filters',
    '~/plugins/vue-lazyload',
    '~/plugins/mapkit',
    '~/plugins/vee-validate',

    '~/plugins/auth'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Load global SASS variables and mixins
    '@nuxtjs/style-resources',

    // Load CloudKit
    '@wwdcscholars/cloudkit',

    // Load Plausible Analytics
    'vue-plausible',

    // Load sentry
    '@nuxtjs/sentry'
  ],

  /*
   ** Global SASS variables and mixins
   */
  styleResources: {
    sass: ['~assets/sass/imports/_index.sass']
  },

  /*
   ** CloudKit configuration
   */
  cloudKit: {
    container: {
      containerIdentifier: process.env[`${envPrefix}_CLOUDKIT_CONTAINER_IDENTIFIER`],
      apiToken: process.env[`${envPrefix}_CLOUDKIT_API_TOKEN`],
      environment: process.env[`${envPrefix}_CLOUDKIT_ENVIRONMENT`]
    },
    authTokenStore: {
      secure: !isDevelopment // don't set `Secure` flag in development mode
    }
  },

  /*
   ** Plausible Analytics configuration
   */
  plausible: {
    domain: process.env[`${envPrefix}_PLAUSIBLE_DOMAIN`],
    apiHost: process.env[`${envPrefix}_PLAUSIBLE_API_HOST`]
  },

  /*
   ** Sentry configuration
   */
  sentry: {
    disabled: isDevelopment,
    dsn: process.env.SENTRY_DSN,
    config: {
      environment: process.env[`${envPrefix}_SENTRY_ENVIRONMENT`],
      release: `app@v${version}`,
      beforeBreadcrumb(breadcrumb, hint) {
        if (breadcrumb.type === 'ui') return null
        return breadcrumb
      }
    }
  },

  /*
   ** Extend router configuration
   */
  router: {
    extendRoutes(routes: any[], resolve: Function) {
      // Add route for year selection
      routes.push({
        name: 'scholars-year',
        path: '/:year?',
        component: resolve(__dirname, 'pages/index.vue')
      })
    }
  },

  /*
   ** Build modules
   */
  buildModules: ['@nuxt/typescript-build'],

  /*
   ** Build configuration
   */
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config: any/*, ctx*/) {
      config.node = {
        fs: 'empty'
      }

      // enable source maps
      if (isLocal) {
        config.devtool = 'source-map'
      }
    }
  },

  /*
   ** Generate a 404 page
   */
  generate: {
    fallback: '404.html'
  },

  /*
   ** Lifecycle hooks
   */
  hooks: {
    build: {
      done() {
        // misbehaving CloudKit import workaround
        if (!isDevelopment) {
          setTimeout(() => process.exit(0), 1000)
        }
      }
    }
  }
}

export default config
