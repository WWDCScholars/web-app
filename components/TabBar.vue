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
  padding: 10px 15px
  margin: 0
  align-items: center

  a
    margin: 0 15px
    padding: 8px 15px
    font-size: 1em
    font-weight: 500
    text-decoration: none
    color: $apl-black
    border-radius: 1em
    transition: color 100ms linear, background-color 100ms linear

    &:hover, &.nuxt-link-exact-active
      background-color: $apl-black
      color: $white

    &.nuxt-link-exact-active
      font-weight: 700
      box-shadow: 0 0 4px 2px $shadow


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
