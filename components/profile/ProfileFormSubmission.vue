<template lang="pug">
base-section
  h2 {{ title }}
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

      .group(v-if="yearHasDistinguishedWinnerFeature")
        h3 Were you recognized as a Distinguished Winner?
        form-field(name="Distinguished Winner", vid="isDistinguishedWinner")
          input-checkbox(
            :name="year + '_distinguishedWinner'"
            label="I was recognized as a Distinguished Winner",
            v-model="formData.isDistinguishedWinner"
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
        h3 In order to validate your submission, please upload a screenshot of the Submission Page and your Developer Account
        form-field(
          name="Validation Screenshot",
          vid="validationScreenshot",
          rules="required"
        )
          template(#comment).
            We recommend taking a single screenshot of two side-by-side browser windows. One window shows #[a(href="https://developer.apple.com/swift-student-challenge/apply/", target="_blank") your Submission (developer.apple.com/swift-student-challenge/apply)] and the other one #[a(href="https://developer.apple.com/account/", target="_blank") your Developer Account (developer.apple.com/account)]. Make sure that your name in the top-right corner of the Developer Account page is clearly visible the screenshot.
          template
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
import {
  BaseSection,
  BaseForm,
  FormField,
  InputText,
  InputImage,
  InputImageMultiple,
  InputRadioGroup,
  InputCheckbox
} from '~/components'
import { ValidationObserver } from 'vee-validate'
import { WWDCYear } from '@wwdcscholars/cloudkit'

@Component({
  components: {
    BaseSection,
    BaseForm,
    FormField,
    InputText,
    InputImage,
    InputImageMultiple,
    InputRadioGroup,
    InputCheckbox,
    ValidationObserver
  }
})
class ProfileFormSubmission extends Vue {
  @Model('change')
  formData!: ProfileFormSubmission.Model

  @Prop({ type: String, required: true })
  year!: string
  @Prop({ type: String, default: 'Submission' })
  title!: string
  @Prop({ type: Array, default: () => [] })
  features!: string[]

  appliedAsOptions: { label: string; value: string }[] = [
    { label: 'Student', value: 'student' },
    { label: 'STEM', value: 'stem' },
    { label: 'Developer Academy Member', value: 'academy' }
  ]

  get yearHasDistinguishedWinnerFeature(): boolean {
    return this.features.includes('distinguished-winner')
  }
}

namespace ProfileFormSubmission {
  export interface Model {
    appliedAs?: ('student' | 'stem' | 'academy')
    isDistinguishedWinner?: boolean
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
