<template lang="pug">
header.header
  nuxt-link(to="/").header-link
    h1
      span.wwdc WWDC
      span.scholars Scholars
  .spacer
  slot
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class PageHeader extends Vue {}
</script>

<style lang="sass" scoped>
.header
  position: fixed
  width: 100%
  height: $header-height
  background-color: transparentize($sch-gray4, 0.1)
  border-bottom: 1.5px solid $sch-gray2
  color: $white
  z-index: 999
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 25px 0 40px

  .header-link
    text-decoration: none

    h1
      font-size: 2em
      margin: 0
      padding: 0
      line-height: 100%
      color: $sch-purple
      font-weight: 600

      .scholars
        font-weight: 400
</style>
