import { Configuration } from '@nuxt/types'
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

const config: Configuration = {
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
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
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
    '~/plugins/vue2-google-maps',
    '~/plugins/vee-validate',

    '~/plugins/auth'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Load global SASS variables and mixins
    '@nuxtjs/style-resources',

    // CloudKit connection
    ['@wwdcscholars/cloudkit', {
      containerIdentifier: process.env[`${envPrefix}_CLOUDKIT_CONTAINER_IDENTIFIER`],
      apiToken: process.env[`${envPrefix}_CLOUDKIT_API_TOKEN`],
      environment: process.env[`${envPrefix}_CLOUDKIT_ENVIRONMENT`]
    }],

    // Plausible Analytics
    ['vue-plausible', {
      domain: process.env[`${envPrefix}_PLAUSIBLE_DOMAIN`]
    }],

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
   ** Sentry configuration
   */
  sentry: {
    disabled: isDevelopment,
    dsn: process.env.SENTRY_DSN,
    config: {
      environment: process.env[`${envPrefix}_SENTRY_ENVIRONMENT`],
      release: `app@v${version}`,
      autoBreadcrumbs: {
        'ui': false,
        'location': true,
        'xhr': true
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
        config.devtool = '#source-map'
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
