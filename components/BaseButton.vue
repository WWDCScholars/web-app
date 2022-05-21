<template lang="pug">
.btn
  nuxt-link(
    v-if="to",
    :disabled="disabled",
    :to="to"
  )
    slot
  button(
    v-else,
    :disabled="disabled",
    @click.prevent="onClick"
  )
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Location } from 'vue-router'

@Component
export default class BaseButton extends Vue {
  @Prop({ type: Boolean, default: false })
  disabled!: boolean

  @Prop({ type: String, default: undefined })
  confirm?: string

  @Prop({ type: [String, Object], default: undefined })
  to?: string | Location

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
    width: 100%
    border: 1px solid $grey2
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
      background-color: $fill-secondary

  &.btn-round > button, &.btn-round > a
    padding: 10px 15px
    border: 2px solid $grey2
    border-radius: 32px

    &:hover
      background-color: $background-grouped-tertiary-elevated
      color: $label-primary

+form-colors using ($fg, $bg)
  .btn
    button, a
      background-color: color($bg)
      border-color: color($bg)
      color: color($fg)

      &:hover
        background-color: highlightColor($bg)
        border-color: highlightColor($bg)

      &:disabled
        background-color: $background-grouped-tertiary-elevated
        border-color: $fill-primary
        color: $label-tertiary

    &.btn-secondary
      button, a
        background-color: color($fg)
        border-color: color($bg)
        color: color($bg)

        &:hover
          background-color: color($bg)
          color: color($fg)

        &:disabled
          background-color: color($fg)
          border-color: $label-tertiary
          color: $label-secondary

    &.btn-round
      > button, > a
        background-color: color($fg)
        color: color($bg)

        &:hover
          background-color: color($bg)
          color: color($fg)
</style>
