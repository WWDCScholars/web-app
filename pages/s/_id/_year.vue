<template lang="pug">
.submission(v-if="wwdcYear")
  p.challenge-description
    | {{ challengeDescription }}
    span(v-if="yearInfo.description").
      &nbsp;Here’s how {{ scholar.givenName }} describes
      {{ scholar.gender | possessivePronoun }} winning submission.

  p.description {{ yearInfo.description }}

  swiper(v-if="true", :options.once="swiperOptions").screenshots
      swiper-slide(
        v-for="screenshot in yearInfo.screenshots",
        :key="screenshot.fileChecksum"
      ).screenshot
        img(:src="screenshot.downloadURL")
      .swiper-pagination(slot="pagination")
      .swiper-buttton-prev.swiper-button(slot="button-prev")
      .swiper-buttton-next.swiper-button(slot="button-next")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Scholar, WWDCYear, WWDCYearInfo } from '@wwdcscholars/cloudkit'
import yearToFetch from '~/util/wwdcYear-index'

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
    autoplay: 8000,
    loop: false,
    grabCursor: false,
    setWrapperSize: false,
    spaceBetween: 15,
    slidesPerView: 'auto',
    prevButton: '.swiper-button-prev',
    nextButton: '.swiper-button-next'
  }

  @Years.Getter('byRecordName') yearByRecordName

  get wwdcYear(): WWDCYear {
    return this.yearByRecordName(this.yearInfo.year.recordName)
  }

  get challengeDescription(): string {
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
  margin-top: 40px

  .screenshot
    img
      width: 100%
</style>
