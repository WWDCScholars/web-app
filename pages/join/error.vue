<template lang="pug">
.container-fluid
  .section
    h2.color-blue Could not save your profile
    p Unfortunately, an error occured while transmitting your profile. Please try again later.
    p If the problem persists, please reach out to us by clicking the button below and filling in the form.
    p: base-button(:to.once="contactRoute").contact-button Contact Us
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { RawLocation } from 'vue-router'
import { BaseButton } from '~/components'

@Component({
  components: { BaseButton }
})
export default class PageJoinError extends Vue {
  readonly contactRoute: RawLocation = {
    name: 'contact',
    query: { reason: 'join-error' }
  }

  head(): MetaInfo {
    return { title: 'There was an error | WWDCScholars' }
  }
}
</script>

<style lang="sass" scoped>
p
  text-align: center

.contact-button
  display: inline-block
  margin-top: 40px
</style>
