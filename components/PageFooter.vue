<template lang="pug">
footer
  nuxt-link(to="/imprint") Imprint
  span.separator
  nuxt-link(to="/privacy") Privacy Policy
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class PageFooter extends Vue {}
</script>

<style lang="sass" scoped>
footer
  display: flex
  justify-content: center
  align-items: center
  padding-top: 50px
  font-size: 0.7em

  a
    color: $sch-gray0
    text-decoration: none
    transition: color linear 100ms

    &:hover
      text-decoration: underline
      color: $sch-purple

  .separator
    width: 1px
    height: 0.8em
    background-color: $sch-gray0
    margin: 0 10px
</style>
