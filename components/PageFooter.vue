<template lang="pug">
footer
  div
    nuxt-link(to="/imprint") Imprint
    span.separator
    nuxt-link(to="/privacy") Privacy Policy
    //- span.separator
    //- a(href="https://netlify.com", target="_blank") Hosted on Netlify
    span.separator
    a(href="https://plausible.io/wwdcscholars.com", target="_blank") Stats
  div
    ColorModePicker
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import ColorModePicker from "./ColorModePicker.vue";

@Component({
  components: { ColorModePicker },
})
export default class PageFooter extends Vue {
  colorSchemes: { label: string; value: string }[] = [
    { label: "system", value: "system" },
    { label: "dark", value: "dark" },
    { label: "light", value: "light" },
  ];
}
</script>

<style lang="sass" scoped>
footer
  padding-top: 50px
  font-size: 0.7em

footer div
  display: flex
  justify-content: center
  align-items: center
  margin: 5px

  a
    color: $sch-accent0
    text-decoration: none
    transition: color linear 100ms

    &:hover
      text-decoration: underline
      color: $sch-purple

  .separator
    width: 1px
    height: 0.8em
    background-color: $sch-accent0
    margin: 0 10px
</style>
