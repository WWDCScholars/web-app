<template lang="pug">
.page-store.section-accent-color-blue1
  tab-bar(name="store_section", :tabs="['T-shirts']", initial="T-shirts", @change="onTabChange")

  .container.container-outer
    .container-split-70
      h3 Want everyone to know you're a Scholarship winner?
      p.
        Show support for the project and look good in the process with one of our 2017 T-shirts. We offer various unisex sizes in two different styles, featuring our WWDCScholars logo on front and text around back.

      .image-slider
        swiper(:options="swiperOptions")
          swiper-slide: img(src="~images/tshirt-white-front.jpg")
          swiper-slide: img(src="~images/tshirt-white-back.jpg")
          swiper-slide: img(src="~images/tshirt-grey-front.jpg")
          swiper-slide: img(src="~images/tshirt-grey-back.jpg")
          .swiper-button-prev.swiper-button(slot="button-prev")
          .swiper-button-next.swiper-button(slot="button-next")

      h3 How do I order and recieve my T-shirt?
      p.
        Simply complete the DonorBox form on the right of this page and we will get your T-shirt prepared.
      p.
        If you are ordering in advance of WWDC, we will contact you at the start of the event with details of where and we will be handling out orders.
      p.
        A similar process applies for ordering during WWDC itself. We will be in contact shortly after you complete your order and you can collect your T-shirt from us at an arranged time and location.
      p.
        #[b Please note:] T-shirts are currently available for collection at WWDC only.

      h3 Product Information
      table
        tr
          td: b Sizes
          td XS, S, M, L, XL, XXL
        tr
          td(rowspan="2"): b Style
          td White (coloured logo, purple text)
        tr
          td Dark Grey (white logo, white text)
        tr
          td: b Gender
          td Unisex

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
