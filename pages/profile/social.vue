<template lang="pug">
.container-outer
  navigation-profile
    
  .container-fluid.container-section
    h2 Social Links

    base-form.form-color-green
      .group
        h3 Where else can people find you?
        form-field
          input-text(
            type="url",
            name="twitter",
            placeholder="Twitter Profile URL",
            v-model="twitter"
          )
        form-field
          input-text(
            type="url",
            name="github",
            placeholder="GitHub Profile URL",
            v-model="github"
          )
        form-field
          input-text(
            type="text",
            name="discord",
            placeholder="Discord Username",
            v-model="discord"
          )
        form-field
          input-text(
            type="url",
            name="linkedin",
            placeholder="LinkedIn Profile URL",
            v-model="linkedin"
          )
        form-field
          input-text(
            type="url",
            name="imessage",
            placeholder="iMessage Number or Email",
            v-model="imessage"
          )
        form-field
          input-text(
            type="url",
            name="facebook",
            placeholder="Facebook Profile URL",
            v-model="facebook"
          )
        form-field
          input-text(
            type="url",
            name="website",
            placeholder="Personal Website URL",
            v-model="website"
          )

      base-button.btn-cta Save
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import {
  NavigationProfile,
  InputText,
  BaseForm,
  BaseButton,
  FormField
} from '~/components'

@Component({
  components: {
    NavigationProfile,
    InputText,
    BaseForm,
    BaseButton,
    FormField
  }
})
export default class PageProfileSocial extends Vue {
  currentTab = ''

  twitter = ''
  github = ''
  discord = ''
  linkedin = ''
  imessage = ''
  facebook = ''
  website = ''
}
</script>

<style lang="sass" scoped>
</style>
