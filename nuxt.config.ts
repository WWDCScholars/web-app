import { NuxtConfig } from '@nuxt/types'

const version = require('./package.json').version
const isDevelopment = (process.env.NODE_ENV === 'development')
const isCI = (process.env.CI === 'true')
const baseURL = process.env.BASE_URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:3000'

let envPrefix: string
if (process.env.NODE_ENV === 'production') {
  envPrefix = 'PROD'
} else if (process.env.NODE_ENV === 'staging') {
  envPrefix = 'STAGE'
} else {
  envPrefix = 'DEV'
}

const META = {
  title: 'Welcome to WWDCScholars',
  description: 'Take a look at Apple WWDC Scholarship winners from all around the world as well as their winning submissions!',
  image: `${baseURL}/images/og-image.jpg`,
  url: `${baseURL}`
}

const config: NuxtConfig = {
  ssr: false,
  target: 'static',

  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    title: META.title,
    meta: [
      { name: 'Content-Type', content: 'text/html', charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: META.description, hid: 'description' },

      // Style
      { name: 'theme-color', content: 'rgb(242, 242, 247)', media: '(prefers-color-scheme: light)' },
      { name: 'theme-color', content: 'rgb(0, 0, 0)', media: '(prefers-color-scheme: dark)' },

      // App Store Banner
      { name: 'apple-itunes-app', content: 'app-id=1459158255' },

      // Social Cards
      { property: 'og:type', content: 'website', hid: 'og:type' },
      { property: 'og:title', content: META.title, hid: 'og:title' },
      { property: 'og:description', content: META.description, hid: 'og:description' },
      { property: 'og:image', content: META.image, hid: 'og:image' },
      { property: 'og:image:alt', content: META.title, hid: 'og:image:alt' },
      { property: 'og:url', content: META.url, hid: 'og:url' },
      { name: 'twitter:card', content: 'summary_large_image', hid: 'twitter:card' },
      { name: 'twitter:title', content: META.title, hid: 'twitter:title' },
      { name: 'twitter:description', content: META.description, hid: 'twitter:description' },
      { name: 'twitter:image', content: META.image, hid: 'twitter:image' },
      { name: 'twitter:image:alt', content: META.title, hid: 'twitter:image:alt' },
      { name: 'twitter:url', content: META.url, hid: 'twitter:url' },
      { name: 'twitter:site', content: '@WWDCScholars' }
    ],
    link: [
      { rel: 'canonical', href: META.url, hid: 'canonical' },
      { rel: 'preconnect', href: 'https://api.apple-cloudkit.com' },
      { rel: 'icon', href: '/icons/favicon-48.png' },
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
    baseURL: baseURL,
    mapKitJwt: isDevelopment ? process.env[`${envPrefix}_MAPKIT_JWT`] : undefined,
    linkApiToken: process.env[`${envPrefix}_LINK_API_TOKEN`],
    linkApiBaseURL: process.env[`${envPrefix}_LINK_API_BASE_URL`],
    axios: {
      browserBaseURL: baseURL
    }
  },
  privateRuntimeConfig: {},

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'var(--color-sch-purple)',
    failedColor: 'var(--color-sch-red)'
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

    '~/plugins/auth',
    '~/plugins/axios'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Load CloudKit
    '@wwdcscholars/cloudkit',

    // Load Axios for contact form and link API
    '@nuxtjs/axios',

    // Load sentry
    '@nuxtjs/sentry',

    // Load color-scheme / colorMode
    '@nuxtjs/color-mode'
  ],

  /*
   ** Global SASS variables and mixins
   */
  styleResources: {
    sass: ['~assets/sass/imports/_index.sass'],
    hoistUseStatements: true
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
   ** Sentry configuration
   */
  sentry: {
    disabled: isDevelopment || !isCI,
    dsn: process.env.SENTRY_DSN,
    publishRelease: isCI ? {
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      setCommits: {
        auto: true,
        ignoreMissing: true
      }
    } : {},
    sourceMapStyle: 'hidden-source-map',
    config: {
      environment: process.env[`${envPrefix}_SENTRY_ENVIRONMENT`],
      release: `app@v${version}`,
      beforeBreadcrumb(breadcrumb, hint) {
        if (breadcrumb.category === 'ui.input') return null
        if (breadcrumb.category === 'xhr' && breadcrumb.data?.url?.findIndex('apple-mapkit.com') >= 0) return null
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
  buildModules: [
    // Transpile TypeScript
    '@nuxt/typescript-build',

    // Load global SASS variables and mixins
    '@nuxtjs/style-resources',

    // Load svg loader
    '@nuxtjs/svg',
  ],

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
        fs: 'empty',
        crypto: 'empty'
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
