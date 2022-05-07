<template lang="pug">
.input-select
  .select
    select(
      :name.once="name",
      :value="value",
      @change="updateValue($event.target.value)"
    )
      option(
        v-for="option in options",
        :value="option.value",
      ) {{ option.label }}
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'

@Component
class InputSelect extends Vue {
  @Model('change')
  value!: string

  @Prop({ type: String, required: true })
  name!: string
  @Prop({ type: Array, required: true })
  options!: { label: string, value: string }[]
  // @Prop({ type: Number, default: 0 })
  // directSelect!: number

  updateValue(value) {
    this.$emit('change', value)
  }
}

namespace InputSelect {
  export type Options = { label: string; value: string }[]
}

export default InputSelect
</script>

<style lang="sass" scoped>
.input-select
  select
    width: 100%
    appearance: none
    background-color: transparent
    border: none
    margin: 0
    padding: 12px 15px
    cursor: pointer

  .select
    display: grid
    grid-template-areas: "select"
    align-items: center
    width: 100%
    border: 1px solid $grey2
    border-radius: $border-radius
    color: $label-primary
    background-color: $background-grouped-secondary-elevated
    text-align: center
    transition: border-color 100ms linear, box-shadow 100ms linear

    select, &:after
      grid-area: select

    &:after
      content: ''
      justify-self: end
      width: 0.8em
      height: 0.5em
      margin-right: 15px
      background-color: $label-secondary
      clip-path: polygon(100% 0%, 0 0%, 50% 100%)
      pointer-events: none
      transition: background-color 100ms linear

+form-colors using ($fg, $bg)
  .input-select
    .select:hover
      border-color: color($bg)
      box-shadow: 0 0 4px tertiaryColor($bg)

    .select:hover:after
      background-color: color($bg)
</style>
