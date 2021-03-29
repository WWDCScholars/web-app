<template lang="pug">
button.burger-button(
  @click="toggle",
  :class="{ 'burger-button-active': value }"
)
  each _ in [1, 2, 3, 4]
    span
</template>

<script lang="ts">
import { Component, Model, Vue } from 'nuxt-property-decorator'

@Component
export default class BurgerButton extends Vue {
  @Model('input')
  value!: boolean

  toggle() {
    this.$emit('input', !this.value)
  }
}
</script>

<style lang="sass" scoped>
.burger-button
  position: relative
  width: 30px
  height: 30px
  cursor: pointer
  background: 0
  border: 0

  span
    position: absolute
    display: block
    width: 26px
    height: 2px
    left: 2px
    background-color: $sch-purple
    transition: 300ms ease-in-out

    &:nth-child(1)
      top: 6px

    &:nth-child(2), &:nth-child(3)
      top: 14px

    &:nth-child(4)
      top: 22px

  &.burger-button-active
    span
      &:nth-child(1)
        top: 14px
        left: 50%
        width: 0%

      &:nth-child(2)
        transform: rotate(45deg)

      &:nth-child(3)
        transform: rotate(-45deg)

      &:nth-child(4)
        top: 14px
        left: 50%
        width: 0%
</style>
