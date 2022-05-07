<template lang="pug">
.navigation-mobile
  burger-button(
    :value="isOpen",
    @input="setOpen"
  ).navigation-mobile-toggle
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import BurgerButton from './BurgerButton.vue'

import * as mobileMenu from '~/store/mobile-menu'
const MobileMenu = namespace(mobileMenu.name)

@Component({
  components: { BurgerButton }
})
export default class NavigationMobileButton extends Vue {
  @MobileMenu.State
  isOpen!: boolean

  @MobileMenu.Mutation
  setOpen!: (isOpen: boolean) => void

  @Watch('$route')
  onRouteChanged() {
    this.setOpen(false)
  }
}
</script>

<style lang="sass" scoped>
.navigation-mobile-toggle
  display: none

  +for-phone-only
    display: block

  ::v-deep .burger-button
    z-index: 999
    top: -2px
</style>
