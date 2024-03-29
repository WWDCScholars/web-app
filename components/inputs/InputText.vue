<template lang="pug">
.input-text(:class="{ 'input-has-value': inputHasValue }")
  label
    slot(
      v-if="$slots.default"
    )
    input(
      v-else-if="type === 'email'",
      ref="input",
      type="email",
      :name.once="name",
      :disabled="disabled",
      :autocomplete="autocomplete",
      :value="value",
      @input="update($event.target.value)"
    )
    input(
      v-else-if="type === 'url'",
      ref="input",
      type="url",
      :name.once="name",
      :disabled="disabled",
      :autocomplete="autocomplete",
      :value="value",
      @input="update($event.target.value)"
    )
    input(
      v-else-if="type === 'search'",
      ref="input",
      :name.once="name",
      :disabled="disabled",
      :autocomplete="autocomplete",
      :value="value",
      @input="update($event.target.value)"
    )
    autosize-textarea(
      v-else-if="type === 'textarea'",
      ref="input",
      :name.once="name",
      :disabled="disabled",
      :autocomplete="autocomplete",
      :value="value",
      :maxLength="maxLength",
      @input="update($event)",
      :class="{ 'has-placeholder': placeholder.length }"
    )
    input(
      v-else,
      ref="input",
      type="text",
      :name.once="name",
      :disabled="disabled",
      :autocomplete="autocomplete",
      :value="value",
      @input="update($event.target.value)",
    )
    span.title {{ placeholder }}
    span.optional(v-if="!required") Optional
  .comment(v-if="type === 'textarea' && maxLength") {{ Math.max(maxLength - length, 0) }} / {{ maxLength }} characters remaining
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'
import AutosizeTextarea from './AutosizeTextarea.vue'

@Component({
  components: { AutosizeTextarea }
})
export default class InputText extends Vue {
  @Model('input')
  value!: string

  @Prop({ default: 'text' })
  type!: string
  @Prop({ required: true })
  name!: string
  @Prop({ default: '' })
  placeholder!: string
  @Prop({ default: false })
  required!: boolean
  @Prop({ default: false })
  disabled!: boolean
  @Prop({ default: undefined })
  autocomplete?: string
  @Prop({ default: undefined })
  maxLength?: number

  value_validate: string = this.value || '' // tslint:disable-line

  update(value) {
    const trimmedValue = value.trim()
    this.value_validate = trimmedValue
    this.$emit('input', trimmedValue)
  }

  get length() {
    return this.value ? this.value.length : 0
  }

  get inputHasValue() {
    return this.value && this.value.length > 0
  }

  focus() {
    const input = this.$refs.input as any
    input.focus()
  }
}
</script>

<style lang="sass" scoped>
.input-text
  width: 100%

  label
    display: block
    position: relative

  input, textarea
    width: 100%
    font-size: 1em
    padding: 20px 15px 5px 15px
    background-color: $background-grouped-secondary-elevated
    border: 1px solid $grey2
    border-radius: $border-radius
    color: $label-primary
    appearance: none
    transition: border-color 100ms linear, box-shadow 100ms linear

    &:disabled
      color: $label-secondary
      -webkit-text-fill-color: $label-secondary

      &:hover
        border-color: $grey2 !important

  textarea
    padding-top: 10px

    &.has-placeholder
      padding-top: 20px

  .title
    position: absolute
    top: 13px
    left: 15px
    color: $label-tertiary
    pointer-events: none
    transition: all 100ms linear

  input:focus + .title, textarea:focus + .title, &.input-has-value .title
    top: 5px
    font-size: 0.7em

  .optional
    position: absolute
    color: $label-tertiary
    top: 2px
    right: 15px
    transform: translateY(50%)
    font-size: 0.9em

+form-colors using ($fg, $bg)
  .input-text
    input, textarea
      &:hover, &:focus
        border-color: color($bg)

      &:focus
        box-shadow: 0 0 4px tertiaryColor($bg)

      &:focus + .title
        color: color($bg)
</style>
