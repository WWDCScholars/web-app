<template lang="pug">
.btn
  slot(v-if="hasNobtnSlot", name="nobtn")
  button(v-else, :disabled="disabled")
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class BaseButton extends Vue {
  @Prop({ type: Boolean, default: false })
  disabled!: boolean

  get hasNobtnSlot(): boolean {
    return !!this.$slots.nobtn
  }
}
</script>

<style lang="sass" scoped>
.btn
  > button, a
    display: block
    padding: 12px 15px
    min-width: 160px
    border: 1px solid $form-border-color
    border-radius: $border-radius
    font-size: 1em
    color: $sch-gray
    background-color: $white
    text-align: center
    text-transform: none
    text-decoration: none
    transition: background-color 100ms linear, border-color 100ms linear, color 100ms linear

    &:hover
      background-color: darken($background-gray, 6%)

  &.btn-round > .button, a
    padding: 10px 15px
    border: 2px solid $form-border-color
    border-radius: 32px

    &:hover
      background-color: $background-gray
      color: $white

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')

  .btn
    > button, a
      background-color: $bg
      border-color: $bg
      color: $fg

      &:hover
        background-color: darken($bg, 10%)
        border-color: darken($bg, 10%)

      &:disabled
        background-color: $sch-gray2
        border-color: $sch-gray1

    &.btn-round > button, a
      background-color: $fg
      color: $bg

      &:hover
        background-color: $bg
        color: $fg
</style>
