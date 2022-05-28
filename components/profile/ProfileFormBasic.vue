<template lang="pug">
base-section
  h2 Basic Information

  ValidationObserver(v-slot="{ valid }", ref="form-profile-basic")
    base-form
      .group.group-width-50
        h3 Profile picture
        form-field(
          name="Profile Picture",
          vid="profilePicture",
          rules="required_image|dimensions:250,-1,250,-1"
        )
          template(#comment) This needs to be an image of you or a Memoji with a resolution of at least 250x250.
          template(v-slot="{ validate }")
            input-image(
              name="profilePicture",
              accept="image/*",
              :required.once="true",
              v-model="formData.profilePicture",
              @input="validate"
            )#input-profile-picture

      .group.group-width-50
        h3 Enter some basic details about yourself
        form-field(name="Given Name", rules="required", vid="givenName").field-width-50
          input-text(
            type="text",
            name="givenname",
            placeholder="Given Name",
            :required.once="true",
            v-model="formData.givenName"
          )
        form-field(name="Family Name", rules="required", vid="familyName").field-width-50
          input-text(
            type="text",
            name="familyname",
            placeholder="Family Name",
            :required.once="true",
            v-model="formData.familyName"
          )
        form-field(name="Email", rules="email|required", vid="email")
          input-text(
            type="email",
            name="email",
            placeholder="Email",
            :required.once="true",
            v-model="formData.email"
          )
        form-field(name="Date of Birth", rules="required", vid="birthday")
          input-date(
            name="birthday",
            placeholder="Date of Birth (yyyy-mm-dd)",
            onlyPast="true",
            displayFormat="Y-m-d",
            :required.once="true",
            v-model="formData.birthday"
          )

        h3 Pronouns
        form-field(name="Pronouns", vid="gender")
          input-radio-group(
            name="gender",
            :options.once="pronounsOptions",
            :required.once="true",
            v-model="formData.gender"
          )

      .group
        h3 Tell us where you are from
        form-field(name="Location", rules="required", vid="location")
          input-location(
            name="location",
            placeholder="Hometown / Nearest City",
            required="true",
            v-model="formData.location"
          )

      .group
        h3 Describe yourself in less than 500 characters
        form-field(name="Biography", rules="required|max:500", vid="biography")
          input-text(
            type="textarea",
            name="biography",
            maxLength="500",
            required="true",
            v-model="formData.biography"
          )

      .group.group-flex-spread
        slot(v-bind:valid="valid")
</template>

<script lang="ts">
import { Component, Model, Watch, Vue } from 'nuxt-property-decorator'
import { CloudKit } from '@wwdcscholars/cloudkit'
import {
  BaseSection,
  BaseForm,
  FormField,
  InputText,
  InputDate,
  InputLocation,
  InputImage,
  InputRadioGroup
} from '~/components'
import { ValidationObserver } from 'vee-validate'

@Component({
  components: {
    BaseSection,
    BaseForm,
    FormField,
    InputText,
    InputDate,
    InputLocation,
    InputImage,
    InputRadioGroup,
    ValidationObserver
  }
})
class ProfileFormBasic extends Vue {
  @Model('change')
  formData!: ProfileFormBasic.Model

  pronounsOptions: InputRadioGroup.Options = [
    { label: 'he/him', value: 'male' },
    { label: 'she/her', value: 'female' },
    { label: 'they/them', value: 'other' }
  ]
}

namespace ProfileFormBasic {
  export interface Model {
    profilePicture?: string | File
    givenName?: string
    familyName?: string
    email?: string
    birthday?: number
    gender?: ('male' | 'female' | 'other')
    location?: CloudKit.Location,
    biography?: string
  }
}

export default ProfileFormBasic
</script>

<style lang="sass" scoped>
#input-profile-picture
  ::v-deep .image
    width: 230px
    height: 230px
</style>
