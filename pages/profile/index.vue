<template lang="pug">
.container-fluid
  base-section
    h2 Basic Information

    ValidationObserver(v-slot="{ invalid, changed }")
      base-form
        .group.group-width-50
          h3 Profile Picture
          form-field(
            name="Profile Picture",
            rules="required_image|image|dimensions:250,-1,250,-1",
            comment="This needs to be an image of you with a resolution of at least 250x250.",
            v-slot="{ validate }"
          )
            input-image(
              name="profilePicture",
              accept="image/*",
              :required.once="true",
              v-model="formData.profilePicture",
              @input="validate"
            )#input-profile-picture

        .group.group-width-50
          h3 Enter some basic details about yourself
          form-field(name="Given Name").field-width-50
            input-text(
              type="text",
              name="givenname",
              placeholder="Given Name",
              :required.once="true",
              :disabled="true",
              :value.once="scholar.givenName"
            )
          form-field(name="Family Name").field-width-50
            input-text(
              type="text",
              name="familyname",
              placeholder="Family Name",
              :required.once="true",
              :disabled="true",
              :value.once="scholar.familyName"
            )
          form-field(name="Email", rules="email|required")
            input-text(
              type="email",
              name="email",
              placeholder="Email",
              :required.once="true",
              v-model="formData.email"
            )
          form-field(name="Date of Birth", rules="required")
            input-date(
              name="birthday",
              placeholder="Date of Birth (yyyy-mm-dd)",
              onlyPast="true",
              displayFormat="Y-m-d",
              :required.once="true",
              v-model="formData.birthday"
            )

          h3 Gender
          form-field(name="Gender")
            input-radio-group(
              name="gender",
              :options.once="genderOptions",
              :required.once="true",
              v-model="formData.gender"
            )

        .group
          h3 Tell us where you are from
          form-field(name="Location", rules="required")
            input-location(
              name="location",
              placeholder="Hometown / Nearest City",
              required="true",
              v-model="formData.location"
            )

        .group
          h3 Describe yourself in less than 300 characters
          form-field(name="Biography", rules="required|max:300")
            input-text(
              type="textarea",
              name="biography",
              maxLength="300",
              required="true",
              v-model="formData.biography"
            )

        base-button(
          :disabled="invalid || !changed",
          @click="submit"
        ).btn-cta Save
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
import { ValidationObserver } from 'vee-validate'

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
    InputRadioGroup,
    ValidationObserver
  }
})
export default class PageProfileBasic extends Vue {
  genderOptions: { label: string; value: string }[] = [
    { label: 'male', value: 'male' },
    { label: 'female', value: 'female' },
    { label: 'other', value: 'other' }
  ]

  formData: {
    profilePicture?: string | File;
    email?: string;
    birthday?: number;
    gender?: ('male' | 'female' | 'other');
    location?: CloudKit.Location;
    biography?: string;
  } = {}

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

  created() {
    this.formData = {
      profilePicture: this.scholar?.profilePicture.downloadURL,
      email: this.scholar?.loadedPrivate?.email,
      birthday: this.scholar?.birthday,
      gender: this.scholar?.gender,
      location: this.scholar?.location,
      biography: this.scholar?.biography
    }
  }

  submit() {

  }
}
</script>

<style lang="sass" scoped>
#input-profile-picture
  /deep/ .image
    width: 230px
    height: 230px
</style>
