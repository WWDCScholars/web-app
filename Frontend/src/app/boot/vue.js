/* global RELEASE */

import Vue from 'vue'
import { settings } from 'config'
import moment from 'moment'

// Vue plugins
import Router from 'vue-router'
import Store from 'vue-stash'
import * as VueGoogleMaps from 'vue2-google-maps'
import VeeValidate, { Validator } from 'vee-validate'
// import '../modules/inputValidators' // TODO
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

Validator.installDateTimeValidators(moment)

void [Router, Store, VeeValidate].forEach(Plugin => Vue.use(Plugin))

Vue.use(VueGoogleMaps, {
  load: {
    key: settings.googleMaps.apiKey,
    libraries: 'places' // If place input is needed
  }
})

Raven
  .config(settings.sentry.clientKey, {
    environment: settings.sentry.environment,
    autoBreadcrumbs: { 'ui': false },
    release: RELEASE
  })
  .addPlugin(RavenVue, Vue)
  // .install()

export { Vue, Router, Raven }
