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
    color: $sch-gray
    background-color: $white
    text-align: center
    text-transform: none
    text-decoration: none
    transition: background-color 100ms linear, border-color 100ms linear, color 100ms linear

    +for-phone-only
      min-width: 100px

    &:hover
      background-color: darken($background-gray, 6%)

  &.btn-round > .button, a
    padding: 10px 15px
    border: 2px solid $form-border-color
    border-radius: 32px

    &:hover
      background-color: $background-gray
      color: $white

  .btn-confirm
    position: absolute
    max-width: 360px
    bottom: calc(100% + 4px)
    padding: 8px
    background-color: $white
    border: 1px solid $sch-gray3
    border-radius: $border-radius
    opacity: 1
    transition: opacity 100ms linear
    +shadow

    &.hidden
      opacity: 0

    .text
      font-size: 0.8em
      overflow-wrap: break-word
      white-space: pre-line

    .btn-confirm-actions
      display: flex
      justify-content: flex-end
      margin-top: 8px

      button
        margin-left: 8px
        font-size: 0.8em
        padding: 3px 8px
        min-width: auto

        &.btn-cancel
          background-color: $sch-gray0
          border-color: lighten($sch-gray0, 5%)

    .triangle
      position: absolute
      bottom: -20px
      left: 70px
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
        top: -6px
        left: 5px
        border-bottom-right-radius: 2px
        +shadow

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')

  .btn
    button, a
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
