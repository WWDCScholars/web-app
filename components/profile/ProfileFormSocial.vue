<template lang="pug">
base-section
  h2 Social Links

  ValidationObserver(v-slot="{ valid }", ref="form-profile-social")
      base-form
        .group
          h3 Where else can people find you?
          form-field(name="Bluesky", rules="url", vid="bluesky")
            input-text(
              type="url",
              name="bluesky",
              placeholder="Bluesky Profile URL",
              v-model="formData.bluesky"
            )

          form-field(name="Threads", rules="url", vid="threads")
            input-text(
              type="url",
              name="threads",
              placeholder="Threads Profile URL",
              v-model="formData.threads"
            )
        
          form-field(name="Mastodon", rules="url", vid="mastodon")
            input-text(
            type="url",
              name="mastodon",
              placeholder="Mastodon Profile URL",
              v-model="formData.mastodon"
            )

          form-field(name="Twitter", rules="url", vid="twitter")
            input-text(
              type="url",
              name="twitter",
              placeholder="Twitter Profile URL",
              v-model="formData.twitter"
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

          form-field(name="Website", rules="url", vid="website")
            input-text(
              type="url",
              name="website",
              placeholder="Personal Website URL",
              v-model="formData.website"
            )

        .group.group-flex-spread
          slot(v-bind:valid="valid")
</template>

<script lang="ts">
import { Component, Model, Vue } from 'nuxt-property-decorator'
import {
  BaseSection,
  BaseForm,
  FormField,
  InputText
} from '~/components'
import { ValidationObserver, extend } from 'vee-validate'
import phoneOrEmail from '~/util/validation/phoneOrEmail'

// add phoneOrEmail rule, has a quite large dependency
extend('phoneOrEmail', phoneOrEmail)

@Component({
  components: {
    BaseSection,
    BaseForm,
    FormField,
    InputText,
    ValidationObserver
  }
})
class ProfileFormSocial extends Vue {
  @Model('change')
  formData!: ProfileFormSocial.Model
}

namespace ProfileFormSocial {
  export interface Model {
    bluesky?: string
    threads?: string
    mastodon?: string
    twitter?: string
    github?: string
    discord?: string
    linkedin?: string
    imessage?: string
    facebook?: string
    website?: string
  }
}

export default ProfileFormSocial
</script>

<style lang="sass" scoped></style>
