<template lang="pug">
.submission(v-if="wwdcYear && yearInfo")
  p.challenge-description
    | {{ challengeDescription }}
    span(v-if="yearInfo.description").
      &nbsp;Here’s how {{ scholar.givenName }} describes
      {{ scholar.gender | possessivePronoun }} winning submission.

  p.description {{ yearInfo.description }}

  swiper(
    v-if="yearInfo.screenshots && yearInfo.screenshots.length",
    :options="swiperOptions"
  ).screenshots
      swiper-slide(
        v-for="(screenshot, index) in yearInfo.screenshots",
        :key="index"
      ).screenshot
        img(:src="screenshot.downloadURL")
      .swiper-pagination(slot="pagination")
      .swiper-button-prev.swiper-button(slot="button-prev")
      .swiper-button-next.swiper-button(slot="button-next")
  .no-screenshots(v-else)
    i Unfortunately we don't have any screenshots of this submission.
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { Scholar, WWDCYear, WWDCYearInfo, CloudKit } from '@wwdcscholars/cloudkit'
import yearToFetch from '~/util/wwdcYear-index'

import 'swiper/css/swiper.css'

import * as years from '~/store/years'
const Years = namespace(years.name)

@Component({
  components: {
    Swiper, SwiperSlide
  }
})
export default class ScholarProfileSubmission extends Vue {
  @Prop({ required: true })
  scholar!: Scholar

  @Prop({ required: true })
  yearInfo!: WWDCYearInfo

  swiperOptions = {
    autoplay: {
      delay: 8000,
      disableOnInteraction: true
    },
    loop: false,
    grabCursor: false,
    setWrapperSize: false,
    spaceBetween: 15,
    slidesPerView: 'auto',
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next'
    },
    pagination: {
      el: '.swiper-pagination'
    }
  }

  @Years.Getter('byRecordName') yearByRecordName

  get wwdcYear(): WWDCYear | undefined {
    if (!this.yearInfo) return undefined
    return this.yearByRecordName(this.yearInfo.year.recordName)
  }

  get challengeDescription(): string {
    if (!this.wwdcYear) return ''
    return this.wwdcYear.challengeDescription || ''
  }

  validate({ params }): boolean {
    if (!params.year) return true
    return /\d{4}/.test(params.year)
  }

  async fetch() {
    if (this.$route.fullPath === this.$nuxt.context.from.fullPath) return

    // else, load data for new route
    const scholar: Scholar = this.$store.getters['scholars/byRecordName'](this.$route.params.id)
    if (!scholar) return

    const years = scholar.wwdcYears.map((year, index) => {
        return [year, scholar.wwdcYearInfos[index]]
      }) as [CloudKit.Reference, CloudKit.Reference][]

    const ytf = yearToFetch(years, this.$route.params.year)
    if (ytf === null) return

    const [yearReference, yearInfoReference] = ytf

    const promises: Promise<any>[] = []
    if (yearReference && yearInfoReference) {
      // fetch WWDCYear
      promises.push(this.$store.dispatch('years/fetchYear', yearReference.recordName))

      // fetch WWDCYearInfo
      promises.push(this.$store.dispatch('scholars/loadYearInfoIfMissing', {
        scholarRecordName: scholar.recordName,
        yearInfoRecordName: yearInfoReference.recordName
      }))
    }

    await Promise.all(promises)
  }

}
</script>

<style lang="sass" scoped>
.challenge-description
  font-size: 0.85em
  font-style: italic
  color: $apl-black3

.description
  font-size: 0.9em
  white-space: pre-line

.screenshots
  position: relative
  left: -60px
  right: -60px
  width: calc(100% + 120px)
  height: 300px
  margin-top: 40px

  +for-phone-only
    left: -20px
    right: -20px
    width: calc(100% + 40px)

  .screenshot
    width: auto

    img
      height: 100%

.no-screenshots
  font-size: 0.8em
  text-align: center

$swiper-arrow-length: 20px
$swiper-arrow-width: 2px
.swiper-container
  .swiper-button
    background: 0
    width: $swiper-arrow-length
    height: $swiper-arrow-length
    margin-top: -$swiper-arrow-length / 2
    opacity: 0
    transition: opacity 100ms linear
    outline: 0

    &:before, &:after
      content: ''
      display: block
      position: absolute
      background-color: $sch-purple

    &:before
      width: $swiper-arrow-length
      height: $swiper-arrow-width

    &:after
      width: $swiper-arrow-width
      height: $swiper-arrow-length

    &.swiper-button-prev
      transform: rotate(-45deg)

    &.swiper-button-next
      transform: rotate(135deg)

  /deep/.swiper-pagination-bullets
    opacity: 0
    transition: opacity 100ms linear

    .swiper-pagination-bullet
      background: $sch-purple

    .swiper-pagination-bullet-active
      background: $sch-purple

  &:hover .swiper-button, &:hover .swiper-pagination-bullets
    opacity: 1

    &.swiper-button-disabled
      opacity: 0.35
</style>
