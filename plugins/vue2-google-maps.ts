import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps/src/main'

export default ({ env }) => {
  Vue.use(VueGoogleMaps, {
    load: {
      key: env.GOOGLE_MAPS_API_KEY,
      libraries: 'places',
      language: 'en'
    }
  })
}
