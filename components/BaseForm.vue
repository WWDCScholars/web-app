<template lang="pug">
.form
  slot
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class BaseForm extends Vue {}
</script>

<style lang="sass" scoped>
.form
  width: 100%
  display: grid
  grid-template-columns: 1fr 1fr
  grid-gap: 0 15px

  .group
    width: 100%
    margin-bottom: 30px
    grid-column: span 2
    display: grid
    grid-template-columns: 1fr 1fr
    grid-gap: 15px

    &.group-width-50
      grid-column: span 1

      +for-phone-only
        grid-column: span 2

    &.group-flex-spread
      display: flex
      justify-content: space-between
      align-items: center

      ::v-deep .btn-cta
        width: auto

        &:only-child
          margin-left: auto

    &:last-of-type
      margin-bottom: 0

    h3, .field, p
      grid-column: span 2

    p
      margin: 0

    h3
      margin: 0
      margin-bottom: -5px
      font-size: 1em
      font-weight: 400

      +for-phone-only
        padding-left: 0
        padding-right: 0

    .field
      &.field-width-50
        grid-column: span 1

    .group-comment
      grid-column: span 2
      margin-top: -10px
      color: $label-secondary
      font-size: 0.8em

      a
        color: inherit

  ::v-deep .btn-cta
    grid-column: span 2
    justify-self: end
    width: auto
</style>

<style lang="sass">
+form-colors using ($fg, $bg)
  .group h3
    color: color($bg)
</style>


