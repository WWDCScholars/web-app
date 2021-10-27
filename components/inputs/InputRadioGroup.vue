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
export default class InputRadioGroup extends Vue {
  @Model('change')
  value!: string

  @Prop({ type: String, required: true })
  name!: string
  @Prop({ type: Array, required: true })
  options!: { label: string, value: string }[]
  @Prop({ type: Boolean, default: false })
  required!: boolean

  value_validate: string = this.value || ''  // tslint:disable-line

  update(value) {
    this.value_validate = value
    this.$emit('change', value)
  }
}
</script>

<style lang="sass" scoped>
.input-radio-group
  display: flex
  flex-wrap: wrap
  justify-content: flex-start
  align-items: center

  .input-radio
    position: relative
    margin: 0 15px 0 0
    cursor: pointer
    flex-grow: 1
    flex-basis: 80px
    max-width: 150px

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

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')

  .input-radio
    input:checked + span
      background-color: color($bg)
      border-color: color($bg)
      color: color($fg)

    input:checked + span:hover
      background-color: highlightColor($bg)
      border-color: highlightColor($bg)
</style>
