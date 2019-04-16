<template lang="pug">
.container-fluid
  .section
    h2.color-blue1 Coming Soon
    p We are working on a brand new WWDCScholars website and app for 2019!
    p
      | In the meantime you can check our #[a(href="https://twitter.com/WWDCScholars").color-blue1 twitter profile] for updates.
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'


@Component
export default class PageIndex extends Vue {}
</script>

<style lang="sass" scoped>
p
  text-align: center
</style>
