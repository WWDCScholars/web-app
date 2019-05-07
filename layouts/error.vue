<template lang="pug">
.container-fluid
  .section
    h2(v-if="error.statusCode === 404").color-blue1 Page not found
    h2(v-else) Unfortunately there was a problem...

    .error-404(v-if="error.statusCode === 404")
      p The link you clicked may be broken or no longer exists.
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class PageError extends Vue {
  @Prop()
  error!: any
}
</script>

<style lang="sass" scoped>
p
  text-align: center
</style>
