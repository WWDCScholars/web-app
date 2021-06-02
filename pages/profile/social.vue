<template lang="pug">
.container-fluid
  base-section
    h2 Social Links

    ValidationObserver(v-slot="{ invalid, changed }", ref="form")
      base-form
        .group
          h3 Where else can people find you?
          form-field(name="Twitter", rules="url", vid="twitter")
            input-text(
              type="url",
              name="twitter",
              placeholder="Twitter Profile URL",
              v-model="formData.twitter"
            )

          form-field(name="Instagram", rules="url", vid="instagram")
            input-text(
              type="url",
              name="instagram",
              placeholder="Instagram Profile URL",
              v-model="formData.instagram"
            )

          form-field(name="GitHub", rules="url", vid="github")
            input-text(
              type="url",
              name="github",
              placeholder="GitHub Profile URL",
              v-model="formData.github"
            )

          form-field(name="Discord", rules="min:2|max:32", vid="discord")
            input-text(
              type="text",
              name="discord",
              placeholder="Discord Username",
              v-model="formData.discord"
            )

          form-field(name="LinkedIn", rules="url", vid="linkedin")
            input-text(
              type="url",
              name="linkedin",
              placeholder="LinkedIn Profile URL",
              v-model="formData.linkedin"
            )

          form-field(name="iMessage", rules="phoneOrEmail", vid="imessage")
            input-text(
              type="text",
              name="imessage",
              placeholder="iMessage Number or Email",
              v-model="formData.imessage"
            )

          form-field(name="Facebook", rules="url", vid="facebook")
            input-text(
              type="url",
              name="facebook",
              placeholder="Facebook Profile URL",
              v-model="formData.facebook"
            )

          form-field(name="App Store", rules="url", vid="itunes")
            input-text(
              type="url",
              name="itunes",
              placeholder="App Store Developer Page URL",
              v-model="formData.itunes"
            )

          form-field(name="Website", rules="url", vid="website")
            input-text(
              type="url",
              name="website",
              placeholder="Personal Website URL",
              v-model="formData.website"
            )

        base-button(
          :disabled="invalid || !changed",
          @click="submit"
        ).btn-cta Save
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Scholar, ScholarSocialMedia, CloudKit } from '@wwdcscholars/cloudkit'
import {
  InputText,
  BaseSection,
  BaseForm,
  BaseButton,
  FormField
} from '~/components'
import { ValidationObserver, extend } from 'vee-validate'
import { handleSave } from '~/util/edit-profile'
import phoneOrEmail from '~/util/validation/phoneOrEmail'

import { name as profileName } from '~/store/profile'
const Profile = namespace(profileName)

// add phoneOrEmail rule, has a quite large dependency
extend('phoneOrEmail', phoneOrEmail)

@Component({
  components: {
    InputText,
    BaseSection,
    BaseForm,
    BaseButton,
    FormField,
    ValidationObserver
  }
})
export default class PageProfileSocial extends Vue {
  @Profile.Getter
  scholar?: Scholar

  get socialMedia(): ScholarSocialMedia | null {
    if (!this.scholar || !this.scholar.loadedSocialMedia) return null

    return this.scholar.loadedSocialMedia
  }

  get formData(): {
    discord?: string,
    facebook?: string,
    github?: string,
    imessage?: string,
    instagram?: string,
    itunes?: string,
    linkedin?: string,
    twitter?: string,
    website?: string
  } {
    return {
      discord: this.socialMedia?.discord,
      facebook: this.socialMedia?.facebook,
      github: this.socialMedia?.github,
      imessage: this.socialMedia?.imessage,
      instagram: this.socialMedia?.instagram,
      itunes: this.socialMedia?.itunes,
      linkedin: this.socialMedia?.linkedin,
      twitter: this.socialMedia?.twitter,
      website: this.socialMedia?.website
    }
  }

  async fetch() {
    await this.$store.dispatch('profile/loadSocial')
  }

  async submit() {
    if (!this.socialMedia) return

    handleSave(
      this.$refs.form,
      this.formData,
      this.$nuxt,
      async (changes) => {
        await this.saveSocial({
          socialMedia: this.socialMedia!,
          changes
        })
      }
    )
  }

  @Profile.Action
  saveSocial!: (payload: { socialMedia: ScholarSocialMedia, changes: object }) => Promise<void>
}
</script>

<style lang="sass" scoped></style>
