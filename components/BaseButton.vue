<template lang="pug">
button.btn
  slot
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class BaseButton extends Vue {}
</script>

<style lang="sass" scoped>
.btn
  display: block
  padding: 12px 15px
  min-width: 160px
  border: 1px solid $form-border-color
  border-radius: $border-radius
  font-size: 1em
  color: $sch-gray
  background-color: $white
  text-align: center
  text-transform: none
  transition: background-color 100ms linear, border-color 100ms linear, color 100ms linear

  &:hover
    background-color: darken($background-gray, 6%)

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')

  .btn
    background-color: $bg
    border-color: $bg
    color: $fg

    &:hover
      background-color: darken($bg, 10%)
      border-color: darken($bg, 10%)
</style>
