<template lang="pug">
.submission(v-if="wwdcYear && yearInfo")
  p.challenge-description
    | {{ challengeDescription }}
    span(v-if="yearInfo.description").
      &nbsp;Here’s how {{ scholar.givenName }} describes
      {{ scholar.gender | possessivePronoun }} winning submission.

  p.description {{ yearInfo.description }}

  swiper(v-if="yearInfo.screenshots", :options="swiperOptions").screenshots
      swiper-slide(
        v-for="screenshot in yearInfo.screenshots",
        :key="screenshot.fileChecksum"
      ).screenshot
        img(:src="screenshot.downloadURL")
      .swiper-pagination(slot="pagination")
      .swiper-button-prev.swiper-button(slot="button-prev")
      .swiper-button-next.swiper-button(slot="button-next")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Scholar, WWDCYear, WWDCYearInfo } from '@wwdcscholars/cloudkit'
import yearToFetch from '~/util/wwdcYear-index'

import 'swiper/dist/css/swiper.css'

import * as years from '~/store/years'
const Years = namespace(years.name)

@Component({
  components: {
    swiper, swiperSlide
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

  async fetch({ params, store, route, from }) {
    if (route.fullPath === from.fullPath) return

    // else, load data for new route
    const scholar: Scholar = store.getters['scholars/byRecordName'](params.id)

    const index = yearToFetch(scholar.wwdcYears, params.year)
    if (index === -1) return

    const yearReference = scholar.wwdcYears[index]
    const yearInfoReference = scholar.wwdcYearInfos[index]

    const promises: Promise<any>[] = []
    if (yearReference && yearInfoReference) {
      // fetch WWDCYear
      promises.push(store.dispatch('years/fetchYear', yearReference.recordName))

      // fetch WWDCYearInfo
      promises.push(store.dispatch('scholars/loadYearInfoIfMissing', {
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

.screenshots
  position: relative
  left: -60px
  right: -60px
  width: calc(100% + 120px)
  height: 300px
  margin-top: 40px

  .screenshot
    width: auto

    img
      height: 100%

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

    &:before, &:after
      content: ''
      display: block
      position: absolute
      background-color: lighten($sch-purple, 30%)

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
      background: $sch-gray3

    .swiper-pagination-bullet-active
      background: lighten($sch-purple, 30%)

  &:hover .swiper-button, &:hover .swiper-pagination-bullets
    opacity: 1

    &.swiper-button-disabled
      opacity: 0.35
</style>
