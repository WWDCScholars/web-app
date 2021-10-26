<template lang="pug">
ColorScheme(placeholder="...", tag="div")
  .color-mode-picker
    label(
      v-for="mode in colorModes",
      :key="mode.value"
    )
      input(
        type="radio",
        :name="name",
        :value="mode.value",
        :checked="$colorMode.preference === mode.value",
        @change="$colorMode.preference = $event.target.value"
      )
      div {{ mode.label }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ColorModePicker extends Vue {
  @Prop({ required: true, type: String })
  name!: string

  colorModes: { label: string; value: string }[] = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "Auto", value: "system" },
  ]
}
</script>

<style lang="sass" scoped>
.color-mode-picker
  display: inline-flex
  border: 1px solid $sch-purple
  border-radius: 12px
  font-size: 0.6em
  padding: 1px

  label
    input
      appearance: none
      padding: 0
      border: 0

    div
      display: inline-block
      min-width: 42px
      padding: 1px 6px
      line-height: 1.33337
      letter-spacing: -0.01em
      color: $sch-purple
      border: 1px solid transparent
      border-radius: 10px
      text-align: center

    input:checked + div
      background-color: $sch-purple
      color: $label-inverted
</style>
