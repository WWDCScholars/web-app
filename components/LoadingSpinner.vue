<template lang="pug">
.loading-spinner
  div
  div
  div
  div
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class LoadingSpinner extends Vue {}
</script>

<style lang="sass" scoped>
.loading-spinner
  display: inline-block
  position: relative
  width: 1em
  height: 1em

  div
    display: block
    box-sizing: border-box
    position: absolute
    width: 1em
    height: 1em
    border: 0.09em solid
    border-color: currentColor transparent transparent transparent
    border-radius: 50%
    animation: loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite

    &:nth-child(1)
      animation-delay: -0.45s

    &:nth-child(2)
      animation-delay: -0.3s

    &:nth-child(3)
      animation-delay: -0.15s

@keyframes loading-spinner
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
</style>
