<template lang="pug">
footer.container-fluid
  .footer-content
    nav(class="links")
      nuxt-link(to="/imprint") Imprint
      span.separator
      nuxt-link(to="/privacy") Privacy Policy
      span.separator
      a(href="https://plausible.io/wwdcscholars.com", target="_blank") Stats
    div(class="color-mode")
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
  .footer-content
    height: $footer-height
    display: flex
    justify-content: space-between
    align-items: flex-end
    flex-wrap: wrap
    padding: 0 25px

    +for-phone-only
      justify-content: center

      .color-mode
        display: none

    .links
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
</style>
