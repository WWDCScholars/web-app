<template lang="pug">
.profile-button(:class="{ 'nuxt-link-active': linkActive }")
  .auth-pending(v-if="isAuthPending"): loading-spinner
  //- TODO: factor svgs out somehow! make it easier to use and change coclors dynamically
  nuxt-link(v-else-if="!isAuthenticated", to="/signin")
    <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Icon/sign-out</title>
    <g id="Icon/sign-out" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M17.6568542,17.7071068 L1.5,17.7071068 C0.671572875,17.7071068 4.6934861e-16,17.0355339 0,16.2071068 L0,16.2071068 C-4.69425623e-16,15.3785437 0.671436838,14.7067305 1.49999976,14.7062662 L17.5857864,14.6972524 L15.0621186,12.1805201 C14.4763333,11.5963446 14.4750282,10.6479039 15.0592037,10.0621186 C15.0596889,10.0616321 15.0601744,10.061146 15.0606602,10.0606602 L15.0606602,10.0606602 C15.6464466,9.47487373 16.5961941,9.47487373 17.1819805,10.0606602 L21.9497475,14.8284271 C22.7307961,15.6094757 22.7307961,16.8758057 21.9497475,17.6568542 L17.1819805,22.4246212 C16.5961941,23.0104076 15.6464466,23.0104076 15.0606602,22.4246212 L15.0606602,22.4246212 C14.4748737,21.8388348 14.4748737,20.8890873 15.0606602,20.3033009 L17.6568542,17.7071068 Z" id="Path" fill="#413599" fill-rule="nonzero"></path>
        <path d="M31,16 C31,24.2842712 24.2842712,31 16,31 C9.82271892,31 4.51757018,27.2659575 2.21857654,21.9318953 C2.10892778,21.7235196 2.046875,21.4861939 2.046875,21.234375 C2.046875,20.4059479 2.71844788,19.734375 3.546875,19.734375 C4.12727241,19.734375 4.63067907,20.0640116 4.88009085,20.5462808 C4.89752105,20.5711282 4.91155106,20.5959055 4.92180643,20.6204656 C6.73144761,24.9542918 11.0100422,28 16,28 C22.627417,28 28,22.627417 28,16 C28,9.372583 22.627417,4 16,4 C11.0100422,4 6.73144761,7.04570818 4.92180643,11.3795344 C4.91155106,11.4040945 4.89752105,11.4288718 4.88009085,11.4537192 C4.63067907,11.9359884 4.12727241,12.265625 3.546875,12.265625 C2.71844788,12.265625 2.046875,11.5940521 2.046875,10.765625 C2.046875,10.5138061 2.10892778,10.2764804 2.21857654,10.0681047 C4.51757018,4.73404247 9.82271892,1 16,1 C24.2842712,1 31,7.71572875 31,16 Z" id="Path" fill="#413599" fill-rule="nonzero"></path>
    </g>
    </svg>
  button(v-else, @click="open = !open")
    <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 52.6 (67491) - http://www.bohemiancoding.com/sketch -->
    <title>Icon/user</title>
    <desc>Created with Sketch.</desc>
    <g id="Icon/user" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M24.9954751,26.3522325 C27.8865941,23.8378781 29.7142857,20.1323792 29.7142857,16 C29.7142857,8.42580915 23.5741909,2.28571429 16,2.28571429 C8.42580915,2.28571429 2.28571429,8.42580915 2.28571429,16 C2.28571429,20.0999527 4.08483494,23.7796983 6.9366625,26.292823 L6.94372174,26.2889739 L11.3441391,23.8886957 C11.7431652,23.6705391 11.9908174,23.2531478 11.9908174,22.7990261 L11.9908174,21.1884522 C11.648,20.7354435 10.7202783,19.3986783 10.2694957,17.6328348 C9.79867826,17.2471652 9.52375652,16.6756174 9.52375652,16.062887 L9.52375652,14.0900174 C9.52375652,13.607513 9.70128696,13.1394783 10.0173913,12.7716174 L10.0173913,10.1743304 C9.98845217,9.88549565 9.88605217,8.25544348 11.0653217,6.91088696 C12.0909913,5.74052174 13.7510957,5.14782609 16,5.14782609 C18.2489043,5.14782609 19.9090087,5.74052174 20.9346783,6.91144348 C22.1139478,8.256 22.0115478,9.88605217 21.9826087,10.174887 L21.9826087,12.7721739 C22.2992696,13.1400348 22.4762435,13.6080696 22.4762435,14.0905739 L22.4762435,16.0634435 C22.4762435,16.856487 22.0210087,17.5588174 21.3158957,17.8938435 C20.9591652,18.9250783 20.4699826,19.8834087 19.8600348,20.7449043 C19.7409391,20.9124174 19.6257391,21.0649043 19.5166609,21.1995826 L19.5166609,22.8452174 C19.5166609,23.3177043 19.7793391,23.742887 20.2022957,23.9543652 L24.9143652,26.3101217 C24.9414989,26.3237333 24.9685316,26.3377772 24.9954751,26.3522325 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z" id="user" fill="#413599" fill-rule="nonzero"></path>
    </g>
    </svg>
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
  border-bottom: $header-indicator-height solid transparent
  transition: border-bottom-color 100ms linear

  &:hover, &.nuxt-link-active
    border-bottom-color: $sch-purple

  > button, > a
    display: flex
    height: #{$header-height - $header-indicator-height}
    padding: 0 25px
    align-items: center

  .auth-pending
    display: flex
    height: #{$header-height - $header-indicator-height}
    padding: 0 25px
    align-items: center

  svg path
    fill: $sch-purple

button
  border: 0
  background: 0

  .dropdown
    display: none
    position: absolute
    top: #{$header-height - 13px}
    right: 15px
    z-index: 1000
    background-color: $label
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
      background-color: $label
      text-decoration: none
      break-word: none
      padding: 15px 25px
      border-bottom: 1px solid $sch-accent2
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
        color: $label
        background-color: $sch-purple

        svg path
          fill: $label

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
        background-color: $label
        transform: rotate(45deg)
        top: 14px
        left: 5px
        border-top-left-radius: 2px
        +shadow
</style>
