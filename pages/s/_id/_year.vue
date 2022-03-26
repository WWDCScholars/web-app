<template lang="pug">
.submission(v-if="wwdcYear && yearInfo")
  p.challenge-description
    span(v-if="challengeDescription")
      | {{ challengeDescription }}&#32;
    span(v-if="yearInfo.description").
      Here’s how {{ scholar.givenName }} describes
      {{ scholar.gender | possessivePronoun }} winning submission.
    span(v-else-if="!media.length").
      Unfortunately we don't have any details on {{ scholar.givenName }}’s submission.

    //- TODO: Maybe we also want a blurb for only screenshots...

  p.description {{ yearInfo.description }}

  .screenshots(v-if="media.length")
    .thumbnails
      button(
        v-for="(screenshot, index) in media",
        :key="'thumbnail-' + index",
        @click="selectedScreenshot = index",
        :class="`thumbnail-${screenshot.mediaType}`"
      ).thumbnail
        img(v-lazy="screenshot.thumb")

      a(
        v-if="yearInfo.appstoreLink",
        :href="yearInfo.appstoreLink",
        target="_blank"
      ).thumbnail.thumbnail-social.thumbnail-appstore
        IconLink.icon-link
        .content(v-html="require('~/assets/images/icon-social-appstore.svg?raw')")

      a(
        v-if="yearInfo.githubLink",
        :href="yearInfo.githubLink",
        target="_blank"
      ).thumbnail.thumbnail-social.thumbnail-github
        IconLink.icon-link
        .content(v-html="require('~/assets/images/icon-social-github.svg?raw')")

    LightBox(
      :loop.once="true",
      :slideshow.once="false",
      :gallery.once="false",
      :youtubeCookies.once="false",
      :items="media",
      :index="selectedScreenshot",
      @close="selectedScreenshot = null"
    )
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import LightBox from 'vue-cool-lightbox'
import { Scholar, WWDCYear, WWDCYearInfo, CloudKit } from '@wwdcscholars/cloudkit'
import { routeMatchYear, yearMatchYearInfo } from '~/util/wwdcYear-index'
import { getVideoPreviewUrl } from '~/util/video'
import IconLink from '~/assets/images/icon-link.svg?inline'

import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

import { name as scholarsName } from '~/store/scholars'
const Scholars = namespace(scholarsName)

import { name as yearsName } from '~/store/years'
const Years = namespace(yearsName)

@Component({
  components: {
    LightBox,
    IconLink
  }
})
export default class ScholarProfileSubmission extends Vue {
  @Prop({ required: true })
  scholar!: Scholar

  @Years.Getter('byRecordName')
  yearByRecordName!: (recordName: string) => WWDCYear | undefined

  @Years.Action
  fetchYear!: (recordName: string) => Promise<void>

  @Scholars.Action('loadYearInfoIfMissing')
  scholarLoadYearInfoIfMissing!: (payload: { scholarRecordName: string, yearInfoRecordName: string }) => Promise<void>

  selectedScreenshot: number | null = null
  videoPreviewUrl: string | null = null

  /** Approved year reference the page should display */
  get wwdcYearReference(): CloudKit.Reference | undefined {
    if (!this.scholar) return undefined
    return routeMatchYear(this.scholar.wwdcYearsApproved, this.$route.params.year)
  }

  get wwdcYear(): WWDCYear | undefined {
    if (!this.wwdcYearReference) return undefined
    return this.yearByRecordName(this.wwdcYearReference.recordName)
  }

  get yearInfo(): WWDCYearInfo | undefined {
    if (!this.scholar || !this.wwdcYearReference) return undefined
    return this.scholar.loadedYearInfos[this.wwdcYearReference.recordName]
  }

  get challengeDescription(): string {
    if (!this.wwdcYear) return ''
    return this.wwdcYear.challengeDescription || ''
  }

  get media(): object[] {
    if (!this.yearInfo || !this.yearInfo.screenshots) return []

    let result: object[] = []

    if (this.videoPreviewUrl) {
      result.push({
        src: this.yearInfo.videoLink,
        thumb: this.videoPreviewUrl,
        mediaType: 'video'
      })
    }

    return result.concat(
      this.yearInfo.screenshots
        .map(screenshot => ({
          src: screenshot.downloadURL,
          thumb: screenshot.downloadURL, // TODO: different URL when we have the image proxy
          mediaType: 'image'
        }))
    )
  }

  validate({ params }): boolean {
    if (!params.year) return true
    return /\d{4}/.test(params.year)
  }

  async fetch() {
    if (!this.scholar || !this.wwdcYearReference) return

    // load data for year
    const yearInfoReference = yearMatchYearInfo(this.scholar.wwdcYearInfos, this.scholar.wwdcYears, this.wwdcYearReference.recordName)
    if (!yearInfoReference) return

    await Promise.all([
      this.fetchYear(this.wwdcYearReference.recordName),
      this.scholarLoadYearInfoIfMissing({
        scholarRecordName: this.scholar.recordName!,
        yearInfoRecordName: yearInfoReference.recordName
      })
    ])

    if (this.yearInfo && this.yearInfo.videoLink) {
      getVideoPreviewUrl(this.yearInfo.videoLink)
        .then(previewUrl => this.videoPreviewUrl = previewUrl)
    }
  }

  @Watch('$route.params')
  onParamsChanged() {
    this.$fetch()
  }
}
</script>

<style lang="sass" scoped>
@use "sass:math"

.challenge-description
  font-size: 0.85em
  font-style: italic
  color: $label-secondary

.description
  font-size: 0.9em
  white-space: pre-line

.screenshots
  .thumbnails
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))
    grid-gap: 15px

    .thumbnail
      position: relative
      display: block
      overflow: hidden
      padding: 0
      background-color: $background-grouped-tertiary-elevated
      border: 2px solid $fill-tertiary
      border-radius: $border-radius
      transition: border-color 100ms linear

      img
        display: block
        width: 100%
        grid-row: 1 / -1
        grid-column: 1
        object-fit: cover

        &[lazy="loading"], &[lazy="error"]
          padding: 18% 40%

      &.thumbnail-video
        grid-column-end: span 2

        &:after
          content: ''
          display: block
          position: absolute
          top: 50%
          left: 50%
          transform: translate(-50%, -50%)
          width: 64px
          height: 64px
          background-color: $sch-purple-secondary
          mask-image: url("~/assets/images/icon-play.svg")
          transition: background-color 100ms linear

      &.thumbnail-social
        color: $systemWhite

        .content
          padding: 18% 40%
          height: 100%

        .icon-link
          position: absolute
          top: 10px
          left: 10px
          width: 20px
          height: 20px

      &.thumbnail-appstore .content
        background-image: linear-gradient(to bottom, $social-gradient-appstore)

      &.thumbnail-github .content
        background-image: linear-gradient(to bottom, $social-gradient-github)

      &:hover
        border-color: $sch-purple

        &.media-video:after
          background-color: $sch-purple
</style>
