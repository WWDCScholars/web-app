<template lang="pug">
.tab-bar
  slot
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class TabBar extends Vue {}
</script>

<style lang="sass" scoped>
.tab-bar
  display: inline-flex
  background-color: $white
  padding: 15px
  margin: 0
  align-items: center

  a
    margin: 0 15px
    padding: 4px 18px
    font-size: 1.1em
    font-weight: 500
    text-decoration: none
    color: $apl-black
    border-radius: 1.1em
    transition: color 100ms linear, background-color 100ms linear

    &:hover, &.nuxt-link-exact-active
      background-color: $apl-black
      color: $white

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')

  .tab-bar
    a
      color: $bg

      &:hover, &.nuxt-link-exact-active
        background-color: $bg
        color: $fg
</style>
