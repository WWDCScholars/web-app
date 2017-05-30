<template lang="pug">
.scholar-submission
  .scholar-infobox(v-if="yearInfo")
    h2(v-if="yearInfo.appType === 'offline'") Scholarship Submission
    h2(v-else-if="yearInfo.appType === 'online'") App Submission
    h2(v-else-if="yearInfo.appType === 'both'") Submissions
    //- .scholar-infobox.scholar-submission-links(v-if="yearInfo && (yearInfo.githubAppLink || yearInfo.videoLink)")
    //-   a(:href="url(yearInfo.githubAppLink)", alt="GitHub", v-if="yearInfo.githubAppLink").scholar-social-icon
    //-     img(src="~assets.images/icon-github.png")
    //-   a(:href="url(yearInfo.videoLink)", alt="YouTube", v-if="yearInfo.videoLink").scholar-social-icon
    //-     img(src="~assets.images/icon-github.png")

    tab-bar(v-if="yearInfo.appType === 'both'", name="submission", :tabs="['Scholarship', 'App Store']", initial="Scholarship", @change="onTabChange")

    swiper.scholar-submission-screenshots(v-if="!showAppStoreScreenshots && yearInfo.screenshots.length", :options="swiperOptions")
      swiper-slide(v-for="screenshot in yearInfo.screenshots").scholar-screenshot
        img(:src="screenshot.downloadURL")
      .swiper-pagination(slot="pagination")
      .swiper-button-prev.swiper-button(slot="button-prev")
      .swiper-button-next.swiper-button(slot="button-next")

    swiper.scholar-submission-screenshots(v-if="(showAppStoreScreenshots || yearInfo.appType === 'online') && appStoreScreenshotUrls.length", :options="swiperOptions")
      swiper-slide(v-for="url in appStoreScreenshotUrls").scholar-screenshot
        img(:src="url")
      .swiper-pagination(slot="pagination")
      .swiper-button-prev.swiper-button(slot="button-prev")
      .swiper-button-next.swiper-button(slot="button-next")
</template>

<script>
import jsonp from 'jsonp'
import { TabBar } from 'components'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'scholar-submission',
  store: [],
  props: {
    yearInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showAppStoreScreenshots: false,
      appStoreScreenshotUrls: [],
      swiperOptions: {
        autoplay: 8000,
        loop: false,
        grabCursor: false,
        setWrapperSize: false,
        spaceBetween: 15,
        slidesPerView: 'auto',
        paginationClickable: true,
        pagination: '.swiper-pagination',
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next'
      }
    }
  },
  computed: {

  },
  created () {},
  mounted () {},
  methods: {
    url (url) {
      if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
        return url
      }

      return 'http://' + url
    },

    onTabChange (value) {
      this.showAppStoreScreenshots = (value === 'App Store')

      if (this.showAppStoreScreenshots) {
        this.retrieveAppStoreScreenshots()
      }
    },

    retrieveAppStoreScreenshots () {
      if (!this.yearInfo.appStoreSubmissionLink) { return }

      let appID = /(id[0-9]+)/
        .exec(this.yearInfo.appStoreSubmissionLink)[0]
        .replace('id', '')

      if (!appID) { return }
      let lookupURL = 'https://itunes.apple.com/lookup?id=' + appID

      jsonp(lookupURL, null, (err, data) => {
        if (err) {
          throw new Error('Could not fetch from itunes API')
        }

        let result = data.results[0]
        this.appStoreScreenshotUrls = result.screenshotUrls || []
      })
    }
  },
  components: {
    TabBar,
    swiper,
    swiperSlide
  }
}
</script>

<style lang="sass">
@import "~style.module/scholar-submission"
</style>
