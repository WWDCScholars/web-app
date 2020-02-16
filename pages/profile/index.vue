<template lang="pug">
.container-fluid
  base-section
    h2 Basic Information

    base-form
      .group.group-width-50
        h3 Profile Picture
        form-field(comment="This needs to be an image of you with a resolution of at least 250x250.")
          input-image(
            name="profilePicture",
            accept="image/*",
            required="true",
            :value="[scholar.profilePicture.downloadURL]"
          )#input-profile-picture

      .group.group-width-50
        h3 Enter some basic details about yourself
        form-field.field-width-50
          input-text(
            type="text",
            name="givenname",
            placeholder="Given Name",
            required="true",
            :value="scholar.givenName"
          )
        form-field.field-width-50
          input-text(
            type="text",
            name="familyname",
            placeholder="Family Name",
            required="true",
            :value="scholar.familyName"
          )
        form-field
          input-text(
            type="email",
            name="email",
            placeholder="Email",
            :required.once="true",
            :value="scholar.loadedPrivate.email"
          )
        form-field
          input-date(
            name="birthday",
            placeholder="Date of Birth (yyyy-mm-dd)",
            onlyPast="true",
            displayFormat="Y-m-d",
            :required.once="true",
            :value="scholar.birthday"
          )

        h3 Gender
        form-field
          input-radio-group(
            name="gender",
            :options.once="genderOptions",
            :required.once="true",
            :value="scholar.gender"
          )

      .group
        h3 Tell us where you are from
        form-field
          input-location(
            name="location",
            placeholder="Hometown / Nearest City",
            required="true",
            :value="scholar.location"
          )

      .group
        h3 Describe yourself in less than 300 characters
        form-field
          input-text(
            type="textarea",
            name="shortBio",
            maxLength="300",
            required="true",
            :value="scholar.biography"
          )

      base-button.btn-cta Save
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Scholar, CloudKit } from '@wwdcscholars/cloudkit'
import {
  BaseSection,
  BaseForm,
  BaseButton,
  FormField,
  InputText,
  InputDate,
  InputLocation,
  InputImage,
  InputRadioGroup
} from '~/components'

import { name as authName } from '~/store/auth'
const Auth = namespace(authName)

import { name as scholarsName } from '~/store/scholars'
const Scholars = namespace(scholarsName)

@Component({
  components: {
    BaseSection,
    BaseForm,
    BaseButton,
    FormField,
    InputText,
    InputDate,
    InputLocation,
    InputImage,
    InputRadioGroup
  }
})
export default class PageProfileBasic extends Vue {
  genderOptions: { label: string; value: string }[] = [
    { label: 'male', value: 'male' },
    { label: 'female', value: 'female' },
    { label: 'other', value: 'other' }
  ]

  @Auth.State
  userScholarReference?: CloudKit.Reference

  @Scholars.Getter('byRecordName') scholarByRecordName

  get scholar(): Scholar | null {
    if (!this.userScholarReference) return null

    return this.scholarByRecordName(this.userScholarReference.recordName)
  }

  async fetch({ store, route, from }) {
    // if (route.fullPath === from.fullPath) return

    // else, load data for new route
    const userScholarReference = store.state.auth.userScholarReference
    if (!userScholarReference) return

    await store.dispatch('scholars/fetchScholar', userScholarReference.recordName)
    const scholar: Scholar = store.getters['scholars/byRecordName'](userScholarReference.recordName)
    if (!scholar) return

    await store.dispatch('scholars/loadPrivateIfMissing', {
      scholarRecordName: scholar.recordName,
      privateRecordName: scholar.scholarPrivate.recordName
    })
  }
}
</script>

<style lang="sass" scoped>
#input-profile-picture
  width: 230px
  height: 230px
</style>
