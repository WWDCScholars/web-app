<template lang="pug">
nav.navigation
  nuxt-link(to="/").nuxt-link-root.color-purple: span Scholars
  nuxt-link(to="/activity").color-orange: span Activity
  nuxt-link(to="/store").color-blue1: span Store
  nuxt-link(to="/profile").color-green: span Profile
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Navigation extends Vue {}
</script>

<style lang="sass" scoped>
.navigation
  margin-right: -15px
  display: flex
  align-items: center

  > a
    display: table
    height: $header-height
    padding: 0 15px
    text-decoration: none
    border-bottom: 3px solid transparent
    transition: 100ms linear border-color

    span
      display: table-cell
      vertical-align: middle
      font-weight: 500
      font-size: 1.1em

    &.nuxt-link-exact-active,
    &.nuxt-link-active:not(.nuxt-link-root),
    &:hover
      border-bottom: 3px solid

    &.nav-filled
      span
        display: block
        background-color: $sch-purple
        color: $white
        border-radius: 32px
        margin-top: 14px
        padding: 4px 18px
        transition: 100ms linear background-color

      &:hover
        border-bottom-color: transparent

        span
          background-color: lighten($sch-purple, 10%)
</style>
