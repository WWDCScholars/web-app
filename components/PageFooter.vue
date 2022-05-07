<template lang="pug">
footer.container-fluid
  .footer-content
    .links
      nav
        nuxt-link(to="/imprint") Imprint
        span.separator
        nuxt-link(to="/privacy") Privacy Policy
        span.separator
        nuxt-link(to="/contact") Contact
        span.separator
        a(href="https://plausible.io/wwdcscholars.com", target="_blank") Stats

      .attribution Social icons by #[a(href="https://icons8.com/l/sf/", target="_blank") Icons8]

    .color-mode
      ColorModePicker(name="color-mode-desktop")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ColorModePicker from './ColorModePicker.vue'

@Component({
  components: { ColorModePicker }
})
export default class PageFooter extends Vue {}
</script>

<style lang="sass" scoped>
footer
  width: 100%

  .footer-content
    display: flex
    justify-content: space-between
    align-items: flex-start
    flex-wrap: wrap
    padding: 35px 25px 15px

    +for-phone-only
      justify-content: center

      .color-mode
        display: none

    .links
      nav
        display: inline-flex
        justify-content: center
        align-items: center
        font-size: 0.7em

        a
          color: $label-secondary
          text-decoration: none
          transition: color linear 100ms

          &:hover
            text-decoration: underline
            color: $sch-purple

        .separator
          width: 1px
          height: 0.8em
          background-color: $separator
          margin: 0 10px

    .attribution
      margin-top: 3px
      font-size: 0.6em
      color: $label-tertiary

      a
        color: inherit
        texter-decoration: underline
</style>
