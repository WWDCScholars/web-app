<template lang="pug">
.navigation
  a(v-if="!isIOS",
    href="https://itunes.apple.com/app/scholars-of-wwdc/id1459158255?mt=8",
    target="_blank"
  ).appstore-download
    img(src="~assets/images/appstore.svg")
  nav.navigation-large
    nuxt-link(to="/", :class="scholarsLinkActive").nuxt-link-root.color-purple: span Scholars
    //- nuxt-link(to="/activity").color-orange: span Activity
    //- nuxt-link(to="/store").color-blue1: span Store
    nuxt-link(to="/about").color-green: span About
    profile-button
  .navigation-mobile
    burger-button(v-model="menuOpen").navigation-mobile-toggle
    nav(:class="{ 'navigation-mobile-open': menuOpen }")
      nuxt-link(to="/", :class="scholarsLinkActive").nuxt-link-root.color-purple: span Scholars
      nuxt-link(to="/about").color-green: span About
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { Route } from 'vue-router'
import BurgerButton from './BurgerButton.vue'
import ProfileButton from './ProfileButton.vue'

@Component({
  components: {
    BurgerButton,
    ProfileButton
  }
})
export default class Navigation extends Vue {
  menuOpen: boolean = false

  get scholarsLinkActive(): object {
    return {
      'nuxt-link-profile-active': this.$route.name === 's-id-year' || this.$route.name === 'scholars-year'
    }
  }

  get isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  @Watch('$route')
  onRouteChanged() {
    this.menuOpen = false
  }
}
</script>

<style lang="sass" scoped>
.navigation
  display: flex
  justify-content: flex-end
  align-items: center

.appstore-download
  display: none
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

.navigation-mobile
  display: none

  +for-phone-only
    display: block

  nav
    position: absolute
    top: $header-height
    left: 0
    width: 100%
    z-index: 998
    background-color: $white
    box-shadow: 0 5px 4px 2px $shadow
    opacity: 0
    pointer-events: none
    transition: opacity 200ms ease-in-out

    &.navigation-mobile-open
      opacity: 1
      pointer-events: auto

    > a
      display: table
      width: 100%
      height: $header-height
      font-size: 1.2em
      font-weight: 500
      padding: 0 15px 0 11px
      text-decoration: none
      text-align: center
      border-bottom: 1px solid $sch-gray2
      border-left: 4px solid transparent

      &:last-of-type
        border-bottom: 0

      span
        display: table-cell
        vertical-align: middle

      &.nuxt-link-exact-active,
      &.nuxt-link-profile-active,
      &.nuxt-link-active:not(.nuxt-link-root)
        border-left-color: currentColor

</style>
