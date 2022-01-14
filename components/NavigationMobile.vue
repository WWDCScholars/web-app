<template lang="pug">
.navigation-mobile(:class="{ 'navigation-mobile-open': isOpen }")
  nav
    ul
      li: nuxt-link(to="/", :class="scholarsLinkActive").nuxt-link-root.color-purple: span Scholars
      li: nuxt-link(to="/about").color-green: span About
      li(v-if="!isAuthenticated"): a(href="https://join.wwdcscholars.com", target="_blank").color-blue: span Join
    ul(v-if="!isAuthPending && isAuthenticated").auth-links
      li: nuxt-link(v-if="profileLink", :to="profileLink").color-purple: span Profile
      li: nuxt-link(to="/profile").color-purple: span Edit Profile
      li: button(@click="onSignOutClicked").color-purple: span Sign Out
    ul(v-else-if="!isAuthPending").auth-links
      li: nuxt-link(to="/signin").color-purple: span Sign In
    .spacer
    div(class="color-mode")
      ColorModePicker(name="color-mode-mobile")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { CloudKit } from '@wwdcscholars/cloudkit'
import ColorModePicker from './ColorModePicker.vue'

import * as mobileMenu from '~/store/mobile-menu'
const MobileMenu = namespace(mobileMenu.name)

import * as auth from '~/store/auth'
const Auth = namespace(auth.name)

@Component({
  components: { ColorModePicker }
})
export default class NavigationMobile extends Vue {
  @MobileMenu.State
  isOpen!: boolean

  @Auth.State('isPending')
  isAuthPending!: boolean

  @Auth.Getter
  isAuthenticated!: boolean

  @Auth.State
  userScholarReference?: CloudKit.Reference

  @Auth.Action
  signOut!: () => Promise<void>

  get scholarsLinkActive(): object {
    return {
      'nuxt-link-profile-active': this.$route.name === 's-id-year' || this.$route.name === 'scholars-year'
    }
  }

  get profileLink(): object | undefined {
    if (!this.userScholarReference) return undefined

    return {
      name: 's-id-year',
      params: {
        id: this.userScholarReference.recordName
      }
    }
  }

  onSignOutClicked() {
    this.signOut()
    this.$router.replace('/')
  }
}
</script>

<style lang="sass" scoped>
.navigation-mobile
  display: none
  z-index: 998
  position: fixed
  top: $header-height-mobile
  right: 0
  bottom: 0
  left: 0
  pointer-events: none
  opacity: 0

  +for-phone-only
    display: block

  &.navigation-mobile-open
    pointer-events: auto
    opacity: 1

  ::v-deep .burger-button
    z-index: 999
    top: -2px

  nav
    width: 100%
    height: 0%
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: flex-start
    background-color: $background-primary-base
    transition: opacity 200ms ease-in-out, height 200ms ease-in-out

    ul
      margin: 0
      padding: 5px 40px 5px 20px
      width: 100%
      list-style-type: none

      &.auth-links
        border-top: 1px solid $separator

      li
        a, button
          position: relative
          display: block
          width: calc(100% - 20px)
          font-size: 1.2em
          padding: 12px 0px
          margin-left: 20px
          background: 0
          border: 0
          text-align: left
          text-decoration: none

        a
          &:before
            content: ''
            display: none
            position: absolute
            left: -20px
            top: calc(50% - 2px)
            width: 6px
            height: 6px
            background-color: currentColor
            border-radius: 50%

          &.nuxt-link-exact-active,
          &.nuxt-link-profile-active,
          &.nuxt-link-active:not(.nuxt-link-root)
            &:before
              display: block

    .spacer
      flex-grow: 1

    .color-mode
      align-self: center
      margin-bottom: 20px

  &.navigation-mobile-open nav
    height: calc(100% - env(safe-area-inset-bottom))
</style>
