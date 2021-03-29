<template lang="pug">
.navigation
  nav.navigation-large
    nuxt-link(to="/", :class="scholarsLinkActive").nuxt-link-root.color-purple: span Scholars
    //- nuxt-link(to="/activity").color-orange: span Activity
    //- nuxt-link(to="/store").color-blue1: span Store
    nuxt-link(to="/about").color-green: span About
    profile-button
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ProfileButton from './ProfileButton.vue'

@Component({
  components: { ProfileButton }
})
export default class NavigationDesktop extends Vue {
  get scholarsLinkActive(): object {
    return {
      'nuxt-link-profile-active': this.$route.name === 's-id-year' || this.$route.name === 'scholars-year'
    }
  }
}
</script>

<style lang="sass" scoped>
.navigation
  display: flex
  justify-content: flex-end
  align-items: center

.link-appstore-download
  // display: none
  display: block
  margin-right: 30px

  +for-tablet-landscape-up
    display: block

  img
    height: 35px

.navigation-large
  display: flex
  align-items: center

  +for-phone-only
    display: none

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
    &.nuxt-link-profile-active,
    &.nuxt-link-active:not(.nuxt-link-root),
    &:hover
      border-bottom: 3px solid

  .profile-button
    height: $header-height
</style>
