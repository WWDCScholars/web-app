<template lang="pug">
.page
  page-header(:link="{ path: '/' }")
  .content-wrapper
    nuxt
  page-footer
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { PageHeader, PageFooter } from '~/components'

@Component({
  components: {
    PageHeader,
    PageFooter
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
