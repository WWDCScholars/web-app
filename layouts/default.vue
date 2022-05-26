<template lang="pug">
.page
  page-header(:link="{ path: '/' }")
    template(v-slot:left)
      navigation-mobile-button
    template(v-slot:right)
      navigation-desktop
  navigation-mobile
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
  NavigationMobile,
  NavigationMobileButton
} from '~/components'

@Component({
  components: {
    PageHeader,
    PageFooter,
    NavigationDesktop,
    NavigationMobile,
    NavigationMobileButton
  }
})
export default class LayoutDefault extends Vue {}
</script>

<style lang="sass" scoped>
.page
  // min-height: 100vh
  // min-height: -webkit-fill-available
  height: 100%
  min-height: stretch

  display: flex
  flex-direction: column
  align-items: space-between

  .content-wrapper
    margin-top: $header-height
    flex-grow: 1
    display: flex

    +for-phone-only
      margin-top: $header-height-mobile
</style>
