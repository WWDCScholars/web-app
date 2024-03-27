<template lang="pug">
.input-date(:class="{ 'input-has-value': inputHasValue }")
  label
    input(
      type="date",
      pattern="\d{4}-\d{2}-\d{2}",
      :max="maxDate",
      :name.once="name",
      :value="valueString",
      @input="update($event.target.value)"
    )
    span.title {{ placeholder }}
    span.optional(v-if="!required") Optional
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

@Component
export default class InputDate extends Vue {
  @Model('input', { default: () => new Date().getTime() })
  value!: number

  @Prop({ required: true })
  name!: string
  @Prop({ required: true })
  placeholder!: string
  @Prop({ default: false })
  required!: boolean
  @Prop({ default: false })
  onlyPast!: boolean

  value_validate: number = this.value || new Date().getTime() // tslint:disable-line

  update(value: string) {
    const timestamp = dayjs.utc(value, 'YYYY-MM-DD').valueOf() // we want to have the 0:00 AM UTC version of the date

    this.value_validate = timestamp
    this.$emit('input', timestamp)
  }

  get inputHasValue() {
    return !!this.value
  }

  get valueString(): string {
    return dayjs.utc(this.value).format('YYYY-MM-DD')
  }

  get maxDate(): string | undefined {
    if (!this.onlyPast) return undefined
    return dayjs.utc().format('YYYY-MM-DD')
  }
}
</script>

<style lang="sass" scoped>
.input-date
  width: 100%

  label
    display: block
    position: relative

  input
    width: 100%
    font-size: 1em
    padding: 20px 15px 5px 15px
    background-color: $background-grouped-secondary-elevated
    border: 1px solid $grey2
    border-radius: $border-radius
    color: $label-primary
    transition: border-color 100ms linear, box-shadow 100ms linear
    appearance: none

    &::-webkit-date-and-time-value
      text-align: left

  .title
    position: absolute
    top: 50%
    left: 15px
    transform: translateY(-50%)
    color: $label-tertiary
    pointer-events: none
    transition: all 100ms linear

  input:focus + .title, &.input-has-value .title
    top: 12px
    font-size: 0.7em

  .optional
    position: absolute
    color: $label-tertiary
    top: 50%
    right: 15px
    transform: translateY(-50%)
    font-size: 0.9em

+form-colors using ($fg, $bg)
  .input-date
    input
      &:hover, &:focus
        border-color: color($bg)
      &:focus
        box-shadow: 0px 0px 4px tertiaryColor($bg)
      &:focus + .title
        color: color($bg)
</style>
