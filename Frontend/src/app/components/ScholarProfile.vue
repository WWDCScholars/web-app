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

    .scholar-infobox.scholar-bio {{ s.shortBio }}

    .scholar-infobox.scholar-social-links(v-if="social")
      a(:href="social.facebook", alt="Facebook", v-if="social.facebook")
        img(src="~assets.images/icon-facebook-circle.png")
      a(:href="social.github", alt="GitHub", v-if="social.github")
        img(src="~assets.images/icon-github-circle.png")
      a(:href="social.imessage", alt="iMessage", v-if="social.imessage")
        img(src="~assets.images/icon-messages-circle.png")
      a(:href="social.linkedin", alt="LinkedIn", v-if="social.linkedin")
        img(src="~assets.images/icon-linkedin-circle.png")
      a(:href="social.twitter", alt="Twitter", v-if="social.twitter")
        img(src="~assets.images/icon-twitter-circle.png")
      a(:href="social.website", alt="Website", v-if="social.website")
        img(src="~assets.images/icon-facebook-circle.png")

  h2 Submission
  .scholar-submission
    .scholar-infobox.scholar-submission-links(v-if="yearInfo")
      a(:href="yearInfo.github", alt="GitHub", v-if="yearInfo.github")
        img(src="~assets.images/icon-github-circle.png")
      a(:href="yearInfo.youtube", alt="YouTube", v-if="yearInfo.youtube")
        img(src="~assets.images/icon-github-circle.png")
</template>

<script>
/* global google */
import moment from 'moment'
import { Scholar, WWDCYearInfo, ScholarSocialMedia } from '../models'

export default {
  name: 'scholar-profile',
  store: ['auth'],
  props: {
    year: {
      type: String,
      required: true
    },
    scholar: {
      type: Scholar,
      required: false
    }
  },
  data () {
    return {
      recordName: '',
      profilePictureURL: '',
      s: {},
      social: undefined,
      yearInfo: undefined,
      map_center: { lat: 0, lng: 0 },
      map_zoom: 1,
      loc_city: '-',
      loc_country: '-',

      mapOptions: {
        disableDefaultUI: true,
        gestureHandling: 'none',
        scrollwheel: false,
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
      if (!this.s.firstName && !this.s.lastName) { return '' }
      return this.s.firstName + ' ' + this.s.lastName
    },
    age () {
      if (!this.s.birthday) { return '' }
      return moment().diff(this.s.birthday, 'year')
    },
    attended () {
      if (!this.s.wwdcYears) { return '' }

      var ret = []
      for (var i = 0; i < this.s.wwdcYears.length; i++) {
        let y = this.s.wwdcYears[i].recordName
        ret.push('’' + y.substring(y.length - 2, y.length))
      }
      return ret.join(', ')
    }
  },
  created () {
    this.recordName = this.$route.params.recordName

    if (this.scholar) {
      this.s = this.scholar
      this.loadScholar()
      return
    }

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

      this.s = await new Scholar().fetch(this.recordName)
      this.loadScholar()
    },

    loadScholar () {
      if (!this.s) { return }

      this.loadYearInfo().then(yearInfo => { this.yearInfo = yearInfo })
      this.latestProfilePictureURL().then(url => { this.profilePictureURL = url })
      this.loadSocialMedia().then(socialMedia => { this.socialMedia = socialMedia })

      this.map_center = {
        lat: this.s.location.latitude,
        lng: this.s.location.longitude
      }
      this.map_zoom = 6
      this.setCityFromCoordinates(this.map_center)
    },
    async latestProfilePictureURL () {
      let infoRecord = await this.loadYearInfo(true)
      return infoRecord.profilePicture.downloadURL
    },
    async loadYearInfo (latest) {
      latest = latest || false

      var infoRecordName = ''
      if (latest) {
        infoRecordName = this.s.wwdcYearInfos[this.s.wwdcYearInfos.length - 1].recordName
      } else {
        for (var i = 0; i < this.s.wwdcYears.length; i++) {
          if (this.s.wwdcYears[i].recordName === 'WWDC ' + this.year) {
            infoRecordName = this.s.wwdcYearInfos[i].recordName
          }
        }
      }

      return new WWDCYearInfo().fetch(infoRecordName)
    },
    async loadSocialMedia () {
      return new ScholarSocialMedia().fetch(this.s.socialMedia)
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
@import "~style.module/scholar-profile"
</style>
