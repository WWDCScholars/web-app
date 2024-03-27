<template lang="pug">
.input-radio-group
  label.input-radio(v-for="option in options")
    input(
      type="radio",
      :name.once="name",
      :required.once="required",
      :value="option.value",
      :checked="option.value === value"
      @change="update($event.target.value)"
    )
    span {{ option.label }}
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'

@Component
class InputRadioGroup extends Vue {
  @Model('change')
  value!: string

  @Prop({ type: String, required: true })
  name!: string
  @Prop({ type: Array, required: true })
  options!: { label: string, value: string }[]
  @Prop({ type: Boolean, default: false })
  required!: boolean

  update(value) {
    this.$emit('change', value)
  }
}

namespace InputRadioGroup {
  export type Options = { label: string; value: string }[]
}

export default InputRadioGroup
</script>

<style lang="sass" scoped>
.input-radio-group
  display: flex
  flex-wrap: wrap
  justify-content: flex-start
  align-items: center
  margin-bottom: -15px

  .input-radio
    position: relative
    margin: 0 15px 15px 0
    cursor: pointer
    min-width: 120px

    span
      display: block
      padding: 12px 15px
      border: 1px solid $grey2
      border-radius: $border-radius
      color: $label-secondary
      background-color: $background-grouped-secondary-elevated
      text-align: center
      transition: background-color 100ms linear, border-color 100ms linear, color 100ms linear

      &:hover
        background-color: $fill-secondary

    input
      appearance: none
      outline: 0
      position: absolute
      opacity: 0

+form-colors using ($fg, $bg)
  .input-radio
    input:checked + span
      background-color: color($bg)
      border-color: color($bg)
      color: color($fg)

    input:checked + span:hover
      background-color: highlightColor($bg)
      border-color: highlightColor($bg)
</style>
