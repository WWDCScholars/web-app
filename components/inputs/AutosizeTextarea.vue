<template lang="pug">
textarea(
  :value="value",
  @input="$emit('input', $event.target.value)"
)
</template>

<script lang="ts">
import { Component, Model, Vue } from 'nuxt-property-decorator'
import autosize from 'autosize'

@Component
export default class AutosizeTextarea extends Vue {
  @Model('input')
  value!: string

  mounted() {
    autosize(this.$el)
  }
}
</script>

<style lang="sass" scoped>
</style>
