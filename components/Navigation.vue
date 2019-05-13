<template lang="pug">
nav.navigation
  nuxt-link(to="/").nuxt-link-root.color-purple: span Scholars
  //- nuxt-link(to="/activity").color-orange: span Activity
  //- nuxt-link(to="/store").color-blue1: span Store
  nuxt-link(to="/about").color-green: span About
  //- profile-button
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// import ProfileButton from './ProfileButton.vue'

@Component({
  // components: { ProfileButton }
})
export default class Navigation extends Vue {}
</script>

<style lang="sass" scoped>
.navigation
  display: flex
  align-items: center

  > a
    display: table
    height: $header-height
    font-size: 1.2em
    font-weight: 500
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

  .profile-button
    height: $header-height
</style>
