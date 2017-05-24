<template lang="pug">
.scholar-profile
  gmap-map(:center="map_center", :zoom="map_zoom", :options="mapOptions").scholar-map
    gmap-marker(v-if="map_center.lat && map_center.lng", :position="map_center", :clickable="true", :draggable="false")

  .scholar-info
    .scholar-image
      img(:src="profilePictureURL")
      img(src="~assets.images/wwdcscholars-icon-70.png").scholar-team-badge
    h1.scholar-name {{ fullName }}
    .scholar-location {{ loc_city }}

    .scholar-infobox.scholar-meta
      .scholar-meta-field.scholar-age
        .scholar-label Age
        .scholar-value {{ age }}
      .scholar-meta-field.scholar-country
        .scholar-label Country
        .scholar-value {{ loc_country }}
      .scholar-meta-field.scholar-attended
        .scholar-label Attended
        .scholar-value {{ attended }}

    .scholar-infobox.scholar-bio {{ scholar.shortBio }}

    .scholar-infobox.scholar-social-links
      a(href="", alt="Facebook"): img(src="~assets.images/icon-facebook-circle.png")
      a(href="", alt="GitHub"): img(src="~assets.images/icon-github-circle.png")
      a(href="", alt="iMessage"): img(src="~assets.images/icon-messages-circle.png")
      a(href="", alt="LinkedIn"): img(src="~assets.images/icon-linkedin-circle.png")
      a(href="", alt="Twitter"): img(src="~assets.images/icon-twitter-circle.png")
      a(href="", alt="Website"): img(src="~assets.images/icon-facebook-circle.png")

  h2 Submission
  .scholar-submission
</template>

<script>
/* global google */
import moment from 'moment'
import { Scholar, WWDCYearInfo } from '../models'

export default {
  name: 'scholar-profile',
  store: ['auth'],
  data () {
    return {
      recordName: '',
      profilePictureURL: '',
      scholar: {},
      map_center: { lat: 0, lng: 0 },
      map_zoom: 1,
      loc_city: '-',
      loc_country: '-',

      mapOptions: {
        disableDefaultUI: true,
        gestureHandling: 'none',
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'road', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] }
        ]
      }
    }
  },
  computed: {
    fullName () {
      if (!this.scholar.firstName && !this.scholar.lastName) { return '' }
      return this.scholar.firstName + ' ' + this.scholar.lastName
    },
    age () {
      if (!this.scholar.birthday) { return '' }
      return moment().diff(this.scholar.birthday, 'year')
    },
    attended () {
      if (!this.scholar.wwdcYears) { return '' }

      var ret = []
      for (var i = 0; i < this.scholar.wwdcYears.length; i++) {
        let y = this.scholar.wwdcYears[i].recordName
        ret.push('’' + y.substring(y.length - 2, y.length))
      }
      return ret.join(', ')
    }
  },
  created () {
    this.recordName = this.$route.params.recordName
    if (this.$store.auth.loaded === true) {
      this.onCloudKitInitialized()
    } else {
      this.$store.auth.on('CloudKit_Initialized', this.onCloudKitInitialized)
    }
  },
  mounted () {},
  methods: {
    async onCloudKitInitialized () {
      if (!this.recordName) { return }

      this.scholar = await new Scholar().fetch(this.recordName)
      this.map_center = { lat: this.scholar.location.latitude, lng: this.scholar.location.longitude }
      this.map_zoom = 6
      this.setCityFromCoordinates(this.map_center)
      this.profilePictureURL = await this.latestProfilePictureURL(this.scholar)
    },
    async latestProfilePictureURL (scholar) {
      let infoRecord = scholar.wwdcYearInfos[scholar.wwdcYearInfos.length - 1]
      let info = await new WWDCYearInfo().fetch(infoRecord.recordName)
      return info.profilePicture.downloadURL
    },
    setCityFromCoordinates (location) {
      let geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location }, (results, status) => {
        if (status !== 'OK' || !results[0]) {
          this.loc_city = '-'
          return
        }

        let result = results[0]
        var readableResult = []
        for (var i = 0; i < result.address_components.length; i++) {
          let component = result.address_components[i]
          switch (component.types[0]) {
            case 'locality':
              readableResult.push(component.long_name)
              break
            case 'administrative_area_level_1':
              readableResult.push(component.short_name)
              break
            case 'country':
              readableResult.push(component.long_name)
              this.loc_country = component.short_name
              break

            default:
              break
          }
        }
        this.loc_city = readableResult.join(', ')
      })
    }
  },
  components: {}
}
</script>

<style lang="sass">
@import "~style.page/scholar-profile"
</style>
