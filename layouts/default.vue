<template lang="pug">
.page
  page-header(:link="{ path: '/' }")
    navigation(slot="right")
  .content-wrapper
    nuxt
  page-footer
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { PageHeader, PageFooter, Navigation } from '~/components'

@Component({
  components: {
    PageHeader,
    PageFooter,
    Navigation
  }
})
export default class LayoutDefault extends Vue {}
</script>

<style lang="sass" scoped>
.page
  padding-bottom: 15px
  min-height: 100vh

  .content-wrapper
    position: relative
    top: $header-height
    margin-bottom: $header-height
    min-height: calc(100vh - #{$header-height + $footer-height} - 50px - 15px)
</style>
