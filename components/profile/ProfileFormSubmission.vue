<template lang="pug">
base-section
  h2 Submission
  h3 Now for the fun part. Show us your {{ year }} submission!

  ValidationObserver(v-slot="{ valid, validate }", tag="div", ref="form-profile-submission")
    base-form
      .group
        h3 Applied As
        form-field(name="Applied As", rules="required", vid="appliedAs")
          input-radio-group(
            :name="year + '_appliedAs'",
            :options.once="appliedAsOptions",
            :required.once="true",
            v-model="formData.appliedAs"
          )

      .group
        h3 Describe your winning project in 500 characters or less
        form-field(name="Description", rules="required|max:500", vid="description")
          input-text(
            type="textarea",
            name="description",
            maxLength="500",
            required="true",
            v-model="formData.description"
          )

      .group
        h3 Upload some screenshots that showcase your submission
        form-field(name="Screenshots", rules="required|imageOrString", vid="screenshots")
          input-image-multiple(
            :name="year + '_screenshots'",
            accept.once="image/*",
            :maxCount.once="5",
            v-model="formData.screenshots"
          ).image-height-fixed

      .group
        h3 Is your submission available to view anywhere else? Let us know!
        form-field(name="Video", rules="url", vid="videoLink")
          input-text(
            type="url",
            :name="year + '_video'",
            placeholder="Video URL",
            v-model="formData.videoLink"
          )
        form-field(name="GitHub", rules="url", vid="githubLink")
          input-text(
            type="url",
            :name="year + '_github'",
            placeholder="GitHub Repository URL",
            v-model="formData.githubLink"
          )
        form-field(name="AppStore", rules="url", vid="appstoreLink")
          input-text(
            type="url",
            :name="year + '_appstore'",
            placeholder="App Store URL",
            v-model="formData.appstoreLink"
          )

      .group
        h3 In order to validate your submission, please upload a screenshot of the Events section of your Apple Developer Profile
        form-field(
          name="Validation Screenshot",
          vid="validationScreenshot",
          rules="required",
          :comment="'You can find <a href=\"https://developer.apple.com/account/#/events\" target=\"_blank\")>your Apple Developer Profile here (developer.apple.com/account/#/events)</a>. Make sure the <i>' + year + '</i> entry and your name in the top-right corner are clearly visible in the screenshot.'"
        )
          input-image(
            name="validationScreenshot",
            accept="image/*",
            :required.once="true",
            v-model="formData.acceptanceEmail",
            @input="validate"
          )#input-validation-screenshot

      .group.group-flex-spread
        slot(v-bind:valid="valid")
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'
import { CloudKit } from '@wwdcscholars/cloudkit'
import {
  BaseSection,
  BaseForm,
  FormField,
  InputText,
  InputImage,
  InputImageMultiple,
  InputRadioGroup
} from '~/components'
import { ValidationObserver } from 'vee-validate'

@Component({
  components: {
    BaseSection,
    BaseForm,
    FormField,
    InputText,
    InputImage,
    InputImageMultiple,
    InputRadioGroup,
    ValidationObserver
  }
})
class ProfileFormSubmission extends Vue {
  @Model('change')
  formData!: ProfileFormSubmission.Model

  @Prop({ type: String, required: true })
  year!: string

  appliedAsOptions: { label: string; value: string }[] = [
    { label: 'Student', value: 'student' },
    { label: 'STEM', value: 'stem' },
    { label: 'Developer Academy Member', value: 'academy' }
  ]

  // TODO: Maybe need to load WWDCYear record to get fields
}

namespace ProfileFormSubmission {
  export interface Model {
    appliedAs?: ('student' | 'stem' | 'academy')
    description?: string
    screenshots?: File[]
    videoLink?: string
    githubLink?: string
    appstoreLink?: string
    acceptanceEmail?: File
  }
}

export default ProfileFormSubmission
</script>

<style lang="sass" scoped>
#input-validation-screenshot
  ::v-deep .image
    width: 175px
    height: 120px
</style>
