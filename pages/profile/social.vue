<template lang="pug">
.container-fluid
  base-section
    h2 Social Links

    base-form
      .group(v-if="socialMedia")
        h3 Where else can people find you?
        form-field
          input-text(
            type="url",
            name="twitter",
            placeholder="Twitter Profile URL",
            :value="socialMedia.twitter"
          )
        form-field
          input-text(
            type="url",
            name="github",
            placeholder="GitHub Profile URL",
            :value="socialMedia.github"
          )
        form-field
          input-text(
            type="text",
            name="discord",
            placeholder="Discord Username",
            :value="socialMedia.discord"
          )
        form-field
          input-text(
            type="url",
            name="linkedin",
            placeholder="LinkedIn Profile URL",
            :value="socialMedia.linkedin"
          )
        form-field
          input-text(
            type="text",
            name="imessage",
            placeholder="iMessage Number or Email",
            :value="socialMedia.imessage"
          )
        form-field
          input-text(
            type="url",
            name="facebook",
            placeholder="Facebook Profile URL",
            :value="socialMedia.facebook"
          )
        form-field
          input-text(
            type="url",
            name="website",
            placeholder="Personal Website URL",
            :value="socialMedia.website"
          )

      base-button.btn-cta Save
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
    FormField
  }
})
export default class PageProfileSocial extends Vue {
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
}
</script>

<style lang="sass" scoped></style>
