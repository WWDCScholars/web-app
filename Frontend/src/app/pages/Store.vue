<template lang="pug">
.page-store.section-accent-color-blue1
  tab-bar(name="store_section", :tabs="['T-shirts']", initial="T-shirts", @change="onTabChange")

  .container.container-outer
    .container-split-70
      h3 Want everyone to know you're a Scholarship winner?
      h4.color-purple T-Shirts are now available until May 25, 2018!
      p.
        Show support for the project and look good in the process with our  #WWDCScholars T-shirts. We offer various sizes for both Unisex and Ladies style featuring our logo on front and text around back.

      .image-slider
        swiper(:options="swiperOptions")
          swiper-slide: img(src="~images/tshirt-white-front.jpg")
          swiper-slide: img(src="~images/tshirt-white-back.jpg")
          //- swiper-slide: img(src="~images/tshirt-grey-front.jpg")
          //- swiper-slide: img(src="~images/tshirt-grey-back.jpg")
          .swiper-button-prev.swiper-button(slot="button-prev")
          .swiper-button-next.swiper-button(slot="button-next")

      h3 How do I order and receive my T-shirt?
      p.
        Simply complete the form and we will get your shirt prepared.
      p.
        We will only accept orders until May 25, 2018 and you'll receive your shirt during WWDC. We will reach out to you via email or iMessage in order for you to get your shirt.
      p.
        #[b Please note:] T-shirts are currently available for collection at WWDC only.

      h3 Product Information
      table
        tr
          td(rowspan="2"): b Sizes
          td Unisex-Not Fitted S, M, L, XL 2XL, 3XL
        tr
          td Ladies-Fitted S, M, L, XL, 2XL
        tr
          td(rowspan="2"): b Style
          td White (coloured logo, purple text)

      .image-slider
        swiper(:options="swiperOptions")
          swiper-slide: img(src="~images/tshirt-unisex-not-fitted-size-chart.png")
          swiper-slide: img(src="~images/tshirt-ladies-fitted-size-chart.png")
          swiper-slide: img(src="~images/tshirt.png")
          .swiper-button-prev.swiper-button(slot="button-prev")
          .swiper-button-next.swiper-button(slot="button-next")

    .container-split-30
      donor-box(name="wwdcscholars-shirts")
</template>

<script>
import { TabBar, DonorBox } from 'components'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'store',
  store: ['auth'],
  data () {
    return {
      swiperOptions: {
        autoplay: 4000,
        loop: false,
        grabCursor: false,
        setWrapperSize: true,
        spaceBetween: 15,
        slidesPerView: 'auto',
        paginationHide: true,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next'
      }
    }
  },
  computed: {},
  created () {
    if (this.$store.auth.loaded === true) {
      this.onCloudKitInitialized()
    } else {
      this.$store.auth.on('CloudKit_Initialized', this.onCloudKitInitialized)
    }
  },
  mounted () {},
  methods: {
    onCloudKitInitialized () {},
    onTabChange (value) {}
  },
  components: {
    TabBar,
    DonorBox,
    swiper,
    swiperSlide
  }
}
</script>

<style lang="css">
</style>
