<template lang="pug">
.container-fluid
  base-section
    h2 Social Links

    ValidationObserver(v-slot="{ invalid, changed }")
      base-form
        .group
          h3 Where else can people find you?
          form-field(name="Twitter", rules="url")
            input-text(
              type="url",
              name="twitter",
              placeholder="Twitter Profile URL",
              v-model="formData.twitter"
            )

          form-field(name="GitHub", rules="url")
            input-text(
              type="url",
              name="github",
              placeholder="GitHub Profile URL",
              v-model="formData.github"
            )

          form-field(name="Discord", rules="min:2|max:32")
            input-text(
              type="text",
              name="discord",
              placeholder="Discord Username",
              v-model="formData.discord"
            )

          form-field(name="LinkedIn", rules="url")
            input-text(
              type="url",
              name="linkedin",
              placeholder="LinkedIn Profile URL",
              v-model="formData.linkedin"
            )

          form-field(name="iMessage", rules="phoneOrEmail")
            input-text(
              type="text",
              name="imessage",
              placeholder="iMessage Number or Email",
              v-model="formData.imessage"
            )

          form-field(name="Facebook", rules="url")
            input-text(
              type="url",
              name="facebook",
              placeholder="Facebook Profile URL",
              v-model="formData.facebook"
            )

          form-field(name="Website", rules="url")
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
import { ValidationObserver } from 'vee-validate'

import { name as authName } from '~/store/auth'
const Auth = namespace(authName)

import { name as scholarsName } from '~/store/scholars'
const Scholars = namespace(scholarsName)

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
  formData: {
    twitter?: string,
    github?: string,
    discord?: string,
    linkedin?: string,
    imessage?: string,
    facebook?: string,
    website?: string
  } = {}

  @Auth.State
  userScholarReference?: CloudKit.Reference

  @Scholars.Getter('byRecordName') scholarByRecordName

  get scholar(): Scholar | null {
    if (!this.userScholarReference) return null

    return this.scholarByRecordName(this.userScholarReference.recordName)
  }

  get socialMedia(): ScholarSocialMedia | null {
    if (!this.scholar || !this.scholar.loadedSocialMedia) return null

    return this.scholar.loadedSocialMedia
  }

  async fetch({ store, route, from }) {
    // if (route.fullPath === from.fullPath) return

    // else, load data for new route
    const userScholarReference = store.state.auth.userScholarReference
    if (!userScholarReference) return

    await store.dispatch('scholars/fetchScholar', userScholarReference.recordName)
    const scholar: Scholar = store.getters['scholars/byRecordName'](userScholarReference.recordName)
    if (!scholar) return

    await store.dispatch('scholars/loadSocialMediaIfMissing', {
      scholarRecordName: scholar.recordName,
      socialMediaRecordName: scholar.socialMedia.recordName
    })
  }

  created() {
    this.formData = {
      twitter: this.scholar?.loadedSocialMedia?.twitter,
      github: this.scholar?.loadedSocialMedia?.github,
      discord: this.scholar?.loadedSocialMedia?.discord,
      linkedin: this.scholar?.loadedSocialMedia?.linkedin,
      imessage: this.scholar?.loadedSocialMedia?.imessage,
      facebook: this.scholar?.loadedSocialMedia?.facebook,
      website: this.scholar?.loadedSocialMedia?.website,
    }
  }

  submit() {

  }
}
</script>

<style lang="sass" scoped></style>
