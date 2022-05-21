<template lang="pug">
transition(appear)
  .modal-mask
    .container
      h3 {{ title }}
      loading-spinner.spinner
      h4(v-if="subtitle") {{ subtitle }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import LoadingSpinner from './LoadingSpinner.vue'

@Component({
  components: { LoadingSpinner }
})
export default class ModalLoadingSpinner extends Vue {
  @Prop({ required: true })
  title!: string

  @Prop({ type: String, default: null })
  subtitle?: string
}
</script>

<style lang="sass" scoped>
.modal-mask
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 9998
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  padding: 15px
  background-color: $background-mask

  .container
    padding: 20px 30px
    transform: scale(1)
    background-color: $background-primary-elevated
    border: 1px solid $fill-primary
    border-radius: $border-radius
    text-align: center

    +for-tablet-landscape-up
      width: 500px

    h3, h4
      text-align: center

    h3
      margin-top: 30px

    h4
      margin-bottom: 20px
      font-size: 0.9em
      font-style: italic
      color: $label-secondary

    .spinner
      margin: 50px auto
      font-size: 96px
      color: $sch-purple

  &.v-enter-active, &.v-leave-active
    transition: background-color 200ms linear

    .container
      transition: transform 200ms linear

  &.v-enter, &.v-leave-to
    background-color: rgba(0, 0, 0, 0.0)

    .container
      transform: scale(1.1)

+form-colors using ($fg, $bg)
  .container
    color: color($bg)
</style>
