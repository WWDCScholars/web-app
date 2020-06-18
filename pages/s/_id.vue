<template lang="pug">
.container-outer.form-color-purple
  .scholar-profile
    gmap-map(
      :center="mapCenter",
      :zoom="mapZoom",
      :options.once="mapOptions"
    ).map
      gmap-marker(
        v-if="mapCenter.lat && mapCenter.lng",
        :position="mapCenter",
        :clickable.once="true",
        :draggable.once="false"
      )

    .container-fluid
      base-section
        .image
          img(v-lazy="profilePictureURL")
        .basic-info
          h2
            span.name {{ fullName }}
            span.age {{ age }}
          .location {{ locationSlug }}

        p.short-bio {{ scholar.biography }}

        .social-links(v-if="scholar.loadedSocialMedia")
          a(v-if="scholar.loadedSocialMedia.twitter",
            :href="scholar.loadedSocialMedia.twitter",
            alt="Twitter",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-twitter.png")
          a(v-if="scholar.loadedSocialMedia.github",
            :href="scholar.loadedSocialMedia.github",
            alt="GitHub",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-github.png")
          a(v-if="scholar.loadedSocialMedia.linkedin",
            :href="scholar.loadedSocialMedia.linkedin",
            alt="LinedIn",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-linkedin.png")
          a(v-if="scholar.loadedSocialMedia.imessage",
            :href="'imessage://' + scholar.loadedSocialMedia.imessage",
            alt="iMessage",
          ).social-icon
            img(src="~assets/images/icon-messages.png")
          a(v-if="scholar.loadedSocialMedia.facebook",
            :href="scholar.loadedSocialMedia.facebook",
            alt="Facebook",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-facebook.png")
          a(v-if="scholar.loadedSocialMedia.website",
            :href="scholar.loadedSocialMedia.website",
            alt="Website",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-website.png")

          copyable(
            v-if="scholar.loadedSocialMedia.discord",
            :value="scholar.loadedSocialMedia.discord"
          ).social-icon.social-nolink.social-discord
            img(src="~assets/images/icon-discord.png")

        .scholarships
          h3 Scholarships

          p.scholarships-blurb.
            {{ scholar.givenName }} has been awarded a WWDC scholarship
            {{ numAttended | readableNumber }}
            {{ 'time' | quantize(numAttended) }}.
            Here {{ numAttended | isAre }} the
            {{ 'submission' | quantize(numAttended) }} that got
            {{ scholar.gender | pronoun }} there.

          .submission-selector
            nuxt-link(
              v-for="(link, year) in submissionLinks",
              :to="link",
              :key="year"
            ) {{ year }}

          nuxt-child(:scholar="scholar", :yearInfo="yearInfo")

        base-button(v-if="editProfileLinkVisible").btn-round.edit-profile
          nuxt-link(slot="nobtn", to="/profile") Edit Profile
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { CloudKit, Scholar, WWDCYearInfo } from '@wwdcscholars/cloudkit'
import yearToFetch from '~/util/wwdcYear-index'

import {
  BaseSection,
  BaseButton,
  Copyable
} from '~/components'

import * as auth from '~/store/auth'
const Auth = namespace(auth.name)

import * as scholars from '~/store/scholars'
const Scholars = namespace(scholars.name)

interface Coordinate {
  lat: number
  lng: number
}

@Component({
  components: {
    BaseSection,
    BaseButton,
    Copyable
  },
  scrollToTop: true
})
export default class ScholarProfile extends Vue {
  locationSlug: string = '-'

  mapOptions = {
    disableDefaultUI: true,
    gestureHandling: 'none',
    scrollwheel: false,
    styles: [
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'road', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] }
    ]
  }

  @Scholars.Getter('byRecordName') scholarByRecordName

  @Auth.State
  userScholarReference?: CloudKit.Reference

  get scholar(): Scholar {
    const { id } = this.$route.params
    return this.scholarByRecordName(id) || {}
  }

  get fullName(): string {
    if (!this.scholar.givenName && !this.scholar.familyName) return ''
    return this.scholar.givenName + ' ' + this.scholar.familyName
  }

  get age(): string {
    if (!this.scholar.birthday) return ''
    const birthday = dayjs(this.scholar.birthday)
    return `${dayjs().diff(birthday, 'year')}`
  }

  get attended(): string {
    if (!this.scholar.wwdcYears) return ''

    return this.scholar.wwdcYears
      .map(year => `’${year.recordName.substring(7)}`)
      .join(', ')
  }

  get yearInfo(): WWDCYearInfo | undefined {
    if (!this.scholar.wwdcYears) return undefined

    if (this.$route.params.year) {
      const year = `WWDC ${this.$route.params.year}`
      return this.scholar.loadedYearInfos[year]
    } else {
      const keys = Object.keys(this.scholar.loadedYearInfos).sort()
      return this.scholar.loadedYearInfos[keys[keys.length - 1]]
    }
  }

  get profilePictureURL(): string {
    if (!this.scholar.profilePicture) return ''

    return this.scholar.profilePicture.downloadURL
  }

  get mapCenter(): Coordinate {
    if (!this.scholar.location || !this.scholar.location.latitude || !this.scholar.location.longitude) return { lat: 0, lng: 0 }

    return {
      lat: this.scholar.location.latitude,
      lng: this.scholar.location.longitude
    }
  }

  get mapZoom(): number {
    if (!this.scholar.location) return 0

    return 6
  }

  get numAttended(): number {
    if (!this.scholar.wwdcYears) return 0
    return this.scholar.wwdcYears.length
  }

  get submissionLinks(): { [year: string]: object } {
    if (!this.scholar.wwdcYears) return {}
    const sortedYears = this.scholar.wwdcYears.slice().sort((lhs, rhs) => lhs.recordName.localeCompare(rhs.recordName))
    const lastYearReference = sortedYears[sortedYears.length - 1]
    return sortedYears
      .reduce((acc, yearReference) => {
        const year = yearReference.recordName.substring(5)
        const yearParam = yearReference.recordName === lastYearReference.recordName ? undefined : year

        acc[year] = {
          name: 's-id-year',
          params: {
            id: this.$route.params.id,
            year: yearParam
          }
        }

        return acc
      }, {})
  }

  get editProfileLinkVisible(): boolean {
    return this.userScholarReference !== undefined
      && this.userScholarReference.recordName === this.scholar.recordName
  }

  validate({ params }): boolean {
    return /\b[0-9A-F]{8}\b-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-\b[0-9A-F]{12}\b/.test(params.id)
  }

  async fetch() {
    await this.$store.dispatch('scholars/fetchScholar', this.$route.params.id)
    const scholar: Scholar = this.$store.getters['scholars/byRecordName'](this.$route.params.id)

    if (!scholar) {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404
      }

      throw new Error('Scholar not found')
    }

    const promises: Promise<any>[] = []

    promises.push(this.$store.dispatch('scholars/loadSocialMediaIfMissing', {
      scholarRecordName: scholar.recordName,
      socialMediaRecordName: scholar.socialMedia.recordName
    }))

    if (scholar.wwdcYears && scholar.wwdcYears.length >= 1) {
      const years = scholar.wwdcYears.map((year, index) => {
        return [year, scholar.wwdcYearInfos[index]]
      }) as [CloudKit.Reference, CloudKit.Reference][]

      // find year to fetch
      const ytf = yearToFetch(years, this.$route.params.year)
      if (ytf === null) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = 404
        }

        throw new Error('Year not found')
      }

      const [yearReference, yearInfoReference] = ytf

      if (yearReference && yearInfoReference) {
        // fetch WWDCYear
        promises.push(this.$store.dispatch('years/fetchYear', yearReference.recordName))

        // fetch WWDCYearInfo
        promises.push(this.$store.dispatch('scholars/loadYearInfoIfMissing', {
          scholarRecordName: scholar.recordName,
          yearInfoRecordName: yearInfoReference.recordName
        }))
      }
    }

    await Promise.all(promises)
  }

  async created() {
    // wait unitl google maps is initialized
    await this['$gmapApiPromiseLazy']()

    // geocode readable location
    this.loadLocationSlug(this.mapCenter)
  }

  loadLocationSlug(location: Coordinate): void {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK || !results[0]) {
        this.locationSlug = '-'
        return
      }

      // find result with types = ['locality', 'political']
      const filteredResults = results.filter(result => {
        return result.types.length === 2
          && result.types.includes('locality')
          && result.types.includes('political')
      })

      if (!filteredResults[0]) {
        let builtLocation: { city?: string; state?: string; country?: string } = {}
        for (const component of results[0].address_components) {
          if (component.types.includes('sublocality') || component.types.includes('locality')) {
            builtLocation.city = component.long_name
          }
          if (component.types.includes('administrative_area_level_1')) {
            builtLocation.state = component.short_name
          }
          if (component.types.includes('country')) {
            builtLocation.country = component.long_name
          }
        }
        let addressComponents = [builtLocation.city, builtLocation.state, builtLocation.country]
        this.locationSlug = addressComponents.join(', ')
      } else {
        const result = filteredResults[0]
        this.locationSlug = result.formatted_address
      }
    })
  }

  extendRoute(year?: string): object {
    const route = this.$route
    return {
      name: route.name,
      params: {
        id: route.params.id,
        year: year
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.map
  width: 100%
  height: 360px
  position: relative
  background-color: $sch-gray0

.section
  position: relative
  margin-top: -30px
  padding: 30px 120px

  +for-phone-only
    padding: 30px 20px

  .image
    position: relative
    width: 185px
    height: 185px
    margin-top: -150px

    +for-phone-only
      margin: -150px auto 0 auto

    img
      width: 100%
      height: 100%
      object-fit: cover
      border: 8px solid $white
      background-color: $sch-gray2
      border-radius: 50%
      overflow: hidden
      box-sizing: border-box
      +shadow

      &[lazy="loading"], &[lazy="error"]
        padding: 37%

  h2
    margin-top: 40px
    margin-bottom: 5px
    font-size: 1.8em
    font-weight: 700
    color: $sch-purple

    .age
      margin-left: 10px
      color: lighten($sch-purple, 40%)

  .location
    font-size: 1.2em
    font-weight: 500
    color: $apl-black2

  .short-bio
    margin-top: 30px
    font-size: 0.9em
    white-space: pre

  .social-links
    display: flex
    justify-content: flex-start
    align-items: center
    margin-top: 30px

    .social-icon
      margin-right: 15px

      img
        width: 32px
        height: 32px

      &.social-nolink
        img
          width: 24px
          height: 24px

    .social-discord
      height: 32px
      padding-left: 15px
      color: $sch-gray
      border-left: 1px solid $sch-gray1

      &:first-of-type
        border-left: 0

  .scholarships
    margin-top: 40px

    h3
      font-size: 1.6em
      font-weight: 700
      color: $sch-purple

  .submission-selector
    display: flex
    justify-content: flex-start
    align-items: flex-start
    margin-top: 15px
    margin-bottom: 30px

    a
      position: relative
      padding: 7px 15px
      font-weight: 500
      color: $sch-purple
      border: 2px solid $sch-purple
      border-radius: 22px
      text-decoration: none
      margin-right: 15px
      transition: background-color 100ms linear, color 100ms linear

      &:hover
        background-color: $sch-purple
        color: $white

      &.nuxt-link-exact-active
        font-weight: 700
        background-color: $sch-purple
        color: $white
        +shadow

        &:after
          content: ''
          position: absolute
          display: block
          bottom: -10px
          left: calc(50% - 8px)
          border-top: 8px solid $sch-purple
          border-right: 8px solid transparent
          border-left: 8px solid transparent

  .edit-profile
    position: absolute
    top: 30px
    right: 30px
</style>
