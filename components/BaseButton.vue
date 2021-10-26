<template lang="pug">
.btn
  slot(v-if="hasNobtnSlot", name="nobtn")
  button(
    v-else,
    :disabled="disabled",
    @click="onClick"
  )
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class BaseButton extends Vue {
  @Prop({ type: Boolean, default: false })
  disabled!: boolean

  @Prop({ type: String, default: undefined })
  confirm?: string

  get hasNobtnSlot(): boolean {
    return !!this.$slots.nobtn
  }

  onClick() {
    if (!this.confirm) {
      this.$emit('click')
      return
    }

    if (confirm(this.confirm)) {
      this.$emit('click')
    } else {
      // not confirmed, do nothing
    }
  }
}
</script>

<style lang="sass" scoped>
.btn
  position: relative

  button, a
    display: block
    padding: 12px 15px
    min-width: 160px
    border: 1px solid $form-border-color
    border-radius: $border-radius
    font-size: 1em
    color: $label-primary
    background-color: $background-grouped-tertiary-elevated
    text-align: center
    text-transform: none
    text-decoration: none
    transition: background-color 100ms linear, border-color 100ms linear, color 100ms linear

    +for-phone-only
      min-width: 100px

    &:hover
      background-color: lightenColor('background-gray', -6%)

  &.btn-round > .button, a
    padding: 10px 15px
    border: 2px solid $form-border-color
    border-radius: 32px

    &:hover
      background-color: $background-grouped-tertiary-elevated
      color: $label-primary

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')

  .btn
    button, a
      background-color: getColor($bg)
      border-color: getColor($bg)
      color: getColor($fg)

      &:hover
        background-color: lightenColor($bg, -10%)
        border-color: lightenColor($bg, -10%)

      &:disabled
        background-color: $background-grouped-tertiary-elevated
        border-color: $fill-primary
        color: $label-tertiary

    &.btn-round > button, a
      background-color: getColor($fg)
      color: getColor($bg)

      &:hover
        background-color: getColor($bg)
        color: getColor($fg)
</style>
