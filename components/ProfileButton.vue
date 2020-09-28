<template lang="pug">
.profile-button(:class="{ 'nuxt-link-active': linkActive }")
  .auth-pending(v-if="isAuthPending"): loading-spinner
  nuxt-link(v-else-if="!isAuthenticated", to="/signin")
    img(src="~assets/images/sign-in-out.svg")
  button(v-else, @click="open = !open")
    img(src="~assets/images/user.svg")
    .dropdown(:class="{ show: open }")
      .triangle
      .links
        nuxt-link(v-if="profileLink", :to="profileLink") Profile
        nuxt-link(to="/profile") Edit Profile
        button(@click="onSignOutClicked")
          | Sign Out
          //- This is an SVG so that we can change the path color on hover
          <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Icon/sign-out" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <path d="M17.6568542,17.7071068 L1.5,17.7071068 C0.671572875,17.7071068 4.6934861e-16,17.0355339 0,16.2071068 L0,16.2071068 C-4.69425623e-16,15.3785437 0.671436838,14.7067305 1.49999976,14.7062662 L17.5857864,14.6972524 L15.0621186,12.1805201 C14.4763333,11.5963446 14.4750282,10.6479039 15.0592037,10.0621186 C15.0596889,10.0616321 15.0601744,10.061146 15.0606602,10.0606602 L15.0606602,10.0606602 C15.6464466,9.47487373 16.5961941,9.47487373 17.1819805,10.0606602 L21.9497475,14.8284271 C22.7307961,15.6094757 22.7307961,16.8758057 21.9497475,17.6568542 L17.1819805,22.4246212 C16.5961941,23.0104076 15.6464466,23.0104076 15.0606602,22.4246212 L15.0606602,22.4246212 C14.4748737,21.8388348 14.4748737,20.8890873 15.0606602,20.3033009 L17.6568542,17.7071068 Z" id="Path" fill="#413599" fill-rule="nonzero"></path>
                <path d="M31,16 C31,24.2842712 24.2842712,31 16,31 C9.82271892,31 4.51757018,27.2659575 2.21857654,21.9318953 C2.10892778,21.7235196 2.046875,21.4861939 2.046875,21.234375 C2.046875,20.4059479 2.71844788,19.734375 3.546875,19.734375 C4.12727241,19.734375 4.63067907,20.0640116 4.88009085,20.5462808 C4.89752105,20.5711282 4.91155106,20.5959055 4.92180643,20.6204656 C6.73144761,24.9542918 11.0100422,28 16,28 C22.627417,28 28,22.627417 28,16 C28,9.372583 22.627417,4 16,4 C11.0100422,4 6.73144761,7.04570818 4.92180643,11.3795344 C4.91155106,11.4040945 4.89752105,11.4288718 4.88009085,11.4537192 C4.63067907,11.9359884 4.12727241,12.265625 3.546875,12.265625 C2.71844788,12.265625 2.046875,11.5940521 2.046875,10.765625 C2.046875,10.5138061 2.10892778,10.2764804 2.21857654,10.0681047 C4.51757018,4.73404247 9.82271892,1 16,1 C24.2842712,1 31,7.71572875 31,16 Z" id="Path" fill="#413599" fill-rule="nonzero"></path>
            </g>
          </svg>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { CloudKit } from '@wwdcscholars/cloudkit'
import LoadingSpinner from './LoadingSpinner.vue'

import * as auth from '~/store/auth'
const Auth = namespace(auth.name)

@Component({
  components: { LoadingSpinner }
})
export default class ProfileButton extends Vue {
  open: boolean = false

  @Auth.State('isPending')
  isAuthPending!: boolean

  @Auth.Getter
  isAuthenticated!: boolean

  @Auth.State
  userScholarReference?: CloudKit.Reference

  @Auth.Action
  signOut!: () => Promise<void>

  get linkActive(): boolean {
    if (!this.$route.name) return false

    return this.$route.name.indexOf('profile') === 0
      || this.$route.name === 'signin'
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
.profile-button
  width: 82px
  border-bottom: 3px solid transparent
  transition: border-bottom-color 100ms linear

  &:hover, &.nuxt-link-active
    border-bottom-color: $sch-purple

  > button, > a
    display: flex
    height: $header-height
    padding: 0 25px
    align-items: center

  .auth-pending
    display: flex
    height: $header-height
    padding: 0 25px
    align-items: center

button
  border: 0
  background: 0

  .dropdown
    display: none
    position: absolute
    top: #{$header-height - 13px}
    right: 15px
    z-index: 1000
    background-color: $white
    border-radius: $border-radius-large
    +shadow

    &.show
      display: block

    .links
      border-radius: $border-radius-large
      overflow: hidden

    a, button
      display: block
      font-size: 1.2em
      font-weight: 500
      color: $sch-purple
      background-color: $white
      text-decoration: none
      break-word: none
      padding: 15px 25px
      border-bottom: 1px solid $sch-gray2
      text-align: left
      transition: color 100ms linear, background-color 100ms linear

      svg
        position: relative
        height: 1em
        top: 4px
        left: 10px
        margin-right: 5px

        path
          transition: fill 100ms linear

      &:last-child
        border-bottom: 0

      &:hover
        color: $white
        background-color: $sch-purple

        svg path
          fill: $white

    .triangle
      position: absolute
      top: -20px
      right: 42px
      width: 20px
      height: 20px
      overflow: hidden

      &:after
        content: ''
        position: absolute
        display: block
        width: 10px
        height: 12px
        background-color: $white
        transform: rotate(45deg)
        top: 14px
        left: 5px
        border-top-left-radius: 2px
        +shadow
</style>
