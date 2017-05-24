<template lang="pug">
.page-store.section-accent-color-blue
  tab-bar(name="store_section", :tabs="['T-Shirts']", initial="T-Shirts", @change="onTabChange")

  .conotainer.container-outer
    h2 Want everyone to know you're a Scholarship winner?
    p.
      Show support for the project and look good in the process with one of our 2017 t-shirts. We offer various unisex sizes in two different styles, featuring our WWDCScholars logo on front and text around back.

    .image-slider
      div Img1
      div Img2
      div Img3
      div Img4

    h2 How do I order and recieve my t-shirt?
    p.
      Simply complete the DonorBox form on the right of this page and we will get your t-shirt prepared.
    p.
      If you are ordering in advance of WWDC, we will contact you at the start of the week with details of where and we will be handling out orders.
    p.
      A similar process applies for ordering during WWDC itself. We will be in contact shortly after you complete your order and you can collect your t-shirt from us at an arranged time and location.
    p.
      #[b Please note:] T-shirts are currently available for collection at WWDC only.

    h2 Product Information
    table
      tr
        td Sizes
        td XS, S, M, L, XL, XXL
      tr
        td Style
        td.
          White (coloured logo, purple text)#[br]
          Dark Grey (white logo, white text)
      tr
        td Gender
        td Unisex          
</template>

<script>
import { TabBar } from 'components'

export default {
  name: 'store',
  store: ['auth'],
  data () {
    return {}
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
    TabBar
  }
}
</script>

<style lang="css">
</style>
