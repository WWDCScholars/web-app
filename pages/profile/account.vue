<template lang="pug">
.container-outer
  navigation-profile

  .container-fluid.container-section
    h2 Account Data

    base-form.form-color-green
      .group
        h3 Download your account data
        p.
          Request to download a copy of your account data. You will receive an
          email with a link to download your data. Please allow up to 30 days
          for the email to arrive.
      
      base-button.btn-cta Request Download

  .container-fluid.container-section
    h2 Danger Zone

    base-form.form-color-red
      .group
        h3 Permanently delete your account
        p.
          You're about to permanently delete your WWDCScholars account.#[br]
          Your profile will no longer be viewable on WWDCScholars.com or
          WWDCScholars for iOS. All data associated with your account will be
          deleted permanently. This action cannot be reverted.
      
      base-button.btn-cta Permanently Delete Your Account
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import {
  NavigationProfile,
  BaseForm,
  BaseButton
} from '~/components'

@Component({
  components: {
    NavigationProfile,
    BaseForm,
    BaseButton
  }
})
export default class PageProfileSocial extends Vue {}
</script>

<style lang="sass" scoped>
</style>
