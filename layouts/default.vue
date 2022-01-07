<template lang="pug">
.page
  page-header(:link="{ path: '/' }")
    template(v-slot:left)
      navigation-mobile
    template(v-slot:right)
      navigation-desktop
  .content-wrapper
    nuxt
  page-footer
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import {
  PageHeader,
  PageFooter,
  NavigationDesktop,
  NavigationMobile
} from '~/components'

@Component({
  components: {
    PageHeader,
    PageFooter,
    NavigationDesktop,
    NavigationMobile
  }
})
export default class LayoutDefault extends Vue {}
</script>

<style lang="sass" scoped>
.page
  padding-bottom: 15px
  min-height: 100vh

  .content-wrapper
    padding-top: $header-height
    min-height: calc(100vh - #{$footer-height} - 15px) // 15px is .page padding-bottom

    +for-phone-only
      padding-top: $header-height-mobile
</style>
