<template lang="pug">
textarea(
  :value="value",
  :maxlength="maxLength"
  @input="$emit('input', $event.target.value)"
)
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'
import autosize from 'autosize'

@Component
export default class AutosizeTextarea extends Vue {
  @Model('input')
  value!: string

  @Prop({ default: undefined })
  maxLength?: number

  mounted() {
    autosize(this.$el)
  }
}
</script>

<style lang="sass" scoped>
textarea
  resize: vertical
</style>
