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
            v-model="profilePicture"
          )#input-profile-picture

      .group.group-width-50
        h3 Enter some basic details about yourself
        form-field.field-width-50
          input-text(
            type="text",
            name="firstname",
            placeholder="First Name",
            required="true",
            v-model="firstname"
          )
        form-field.field-width-50
          input-text(
            type="text",
            name="lastname",
            placeholder="Last Name",
            required="true",
            v-model="lastname"
          )
        form-field
          input-text(
            type="email",
            name="email",
            placeholder="Email",
            required="true",
            v-model="email"
          )
        form-field
          input-date(
            name="birthday",
            placeholder="Date of Birth (dd/mm/yyyy)",
            onlyPast="true",
            displayFormat="Y-m-d",
            required="true",
            v-model="birthday"
          )

        h3 Gender
        form-field
          input-radio-group(
            name="gender",
            :options.once="['male', 'female', 'other']",
            required="true",
            v-model="gender"
          )

      .group
        h3 Tell us where you are from
        form-field
          input-location(
            name="location",
            placeholder="Hometown / Nearest City",
            required="true",
            v-model="location"
          )

      .group
        h3 Describe yourself in less than 300 characters
        form-field
          input-text(
            type="textarea",
            name="shortBio",
            maxLength="300",
            required="true",
            v-model="shortBio"
          )

      base-button.btn-cta Save
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
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
  currentTab = 'Basic'

  profilePicture = ''
  firstname = ''
  lastname = ''
  email = ''
  birthday = new Date()
  gender = ''
  location = { lat: 0, lng: 0 }
  shortBio = ''
}
</script>

<style lang="sass" scoped>
#input-profile-picture
  width: 230px
  height: 230px
</style>
