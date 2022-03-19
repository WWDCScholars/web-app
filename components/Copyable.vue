<template lang="pug">
a(@click="onClick").copyable
  slot
  .label
    .value(:class="{ 'show': !isCopied}") {{ value }}
    .copied(:class="{ 'show': isCopied }") copied
  input(
    type="text",
    readonly,
    :value="value",
    ref="input"
  ).input
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Copyable extends Vue {
  @Prop({ required: true })
  value!: string

  isCopied: boolean = false

  onClick() {
    const el = this.$refs['input'] as HTMLInputElement
    el.select()
    document.execCommand('copy')
    el.setSelectionRange(0, 0)
    this.isCopied = true
    setTimeout(() => {
      this.isCopied = false
    }, 2000)
  }
}
</script>

<style lang="sass" scoped>
.copyable
  display: flex
  justify-content: flex-start
  align-items: center
  cursor: pointer

  .label
    position: relative
    font-size: 0.8em
    margin-left: 3px

    .copied
      position: absolute
      display: block
      top: 0
      right: 0
      bottom: 0
      left: 0
      text-align: center

    .value, .copied
      opacity: 0
      transition: opacity 200ms linear

      &.show
        opacity: 1

  .input
    display: inline-block
    border: 0
    background: 0
    pointer-events: none
    width: 0px
    height: 0
</style>

