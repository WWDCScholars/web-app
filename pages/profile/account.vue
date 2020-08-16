<template lang="pug">
.container-fluid
  base-section
    h2 Account Data

    base-form
      .group
        h3 Download your account data
        p.
          Request to download a copy of your account data. You will receive an
          email with a link to download your data. Please allow up to 30 days
          for the email to arrive.

      base-button(
        :disabled="hasPendingDownloadRequest",
        @click="requestDownload"
      ).btn-cta Request Download

  base-section
    h2 Danger Zone

    base-form.form-color-red
      .group
        h3 Permanently delete your account
        p.
          You're about to permanently delete your WWDCScholars account.#[br]
          Your profile will no longer be viewable on WWDCScholars.com or
          WWDCScholars for iOS. All data associated with your account will be
          deleted permanently. This action cannot be reverted.

      base-button(
        confirm="Do you really wan't to delete your account? This action cannot be undone.",
        @click="deleteAccount"
      ).btn-cta Permanently Delete Your Account
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import {
  BaseSection,
  BaseForm,
  BaseButton
} from '~/components'

import { name as profileName } from '~/store/profile'
const Profile = namespace(profileName)

@Component({
  components: {
    BaseSection,
    BaseForm,
    BaseButton
  }
})
export default class PageProfileAccount extends Vue {
  @Profile.Getter
  hasPendingDownloadRequest!: boolean

  async requestDownload() {
    if (this.hasPendingDownloadRequest) {
      return
    }

    this.$nuxt.$loading.start()
    try {
      await this.saveDownloadRequest()
      this.$nuxt.$loading.finish()
    } catch (e) {
      console.error(e)
      this.$nuxt.$loading.fail!()
    }
  }

  async deleteAccount() {
    this.$nuxt.$loading.start()
    try {
      await this.performDeleteAccount()
      this.$nuxt.$loading.finish()
      this.$router.replace('/')
    } catch (e) {
      console.error(e)
      this.$nuxt.$loading.fail!()
    }
  }

  @Profile.Action('requestDownload')
  saveDownloadRequest!: () => Promise<void>

  @Profile.Action('deleteAccount')
  performDeleteAccount!: () => Promise<void>
}
</script>

<style lang="sass" scoped></style>
