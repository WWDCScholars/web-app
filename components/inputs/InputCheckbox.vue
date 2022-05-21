<template lang="pug">
.input-checkbox
  label(:class="{ 'input-disabled': disabled }")
    input(
      type="checkbox",
      :name.once="name",
      :required.once="required",
      :checked="value",
      :disabled="disabled",
      @change="update($event.target.checked)"
    )
    .mark
    span(v-html="label")
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class InputCheckbox extends Vue {
  @Model('change')
  value!: boolean

  @Prop({ type: String, required: true })
  name!: string
  @Prop({ type: String, required: true })
  label!: string
  @Prop({ type: Boolean, default: false })
  required!: boolean
  @Prop({ type: Boolean, default: false })
  disabled!: boolean

  value_validate: boolean = this.value || false

  update(value) {
    this.value_validate = value
    this.$emit('change', value)
  }
}
</script>

<style lang="sass" scoped>
.input-checkbox
  position: relative
  display: block

  label
    display: flex
    justify-content: flex-start
    align-items: flex-start
    width: 100%
    cursor: pointer

    .mark
      position: relative
      width: 28px
      height: 28px
      flex-shrink: 0
      background-color: $background-grouped-secondary-elevated
      border: 1px solid $grey2
      border-radius: $border-radius
      transition: background-color 100ms linear, border-color 100ms linear

      &:after
        content: ''
        position: absolute
        display: block
        top: 8px
        left: 6px
        width: 12px
        height: 6px
        border: 2px solid transparent
        border-top: none
        border-right: none
        background: transparent
        transform: rotate(-45deg)
        transition: border-color 100ms linear

    span
      flex-grow: 1
      margin-top: 3px
      margin-left: 6px
      color: $label-secondary
      word-wrap: break-word

    &:hover .mark:after
      border-color: $label-tertiary

    input:checked + .mark
      background-color: $label-secondary
      border-color: $label-secondary

      &:after
        border-color: $background-grouped-secondary-elevated

  input
    appearance: none
    outline: 0
    position: absolute
    opacity: 0

+form-colors using ($fg, $bg)
  .input-checkbox
    label span ::v-deep a
      color: color($bg)

    label:hover .mark
      // border-color: lighten($bg, 20%)

    input:checked + .mark
      background-color: color($bg)
      border-color: color($bg)

    label.input-disabled
      cursor: default

      .mark
        background-color: $label-tertiary
        border-color: $label-secondary

      span
        color: $label-secondary

        ::v-deep a
          color: $label-secondary
</style>
