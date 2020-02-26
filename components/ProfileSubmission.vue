<template lang="pug">
base-section
  .header
    h2 {{ yearRecordName }}
    .status(v-if="yearInfo", :class="yearInfo.status") {{ yearInfo.status }}

  ValidationObserver(v-slot="{ invalid, changed }")
    base-form(v-if="yearInfo")
      .group
        h3 Applied As
        form-field(name="Applied As")
          input-radio-group(
              :name="yearRecordName + '_appliedAs'",
              :options.once="appliedAsOptions",
              :required.once="true",
              v-model="formData.appliedAs"
            )

      .group
        h3 Screenshots
        form-field(name="Screenshots")
          input-image-multiple(
            :name="yearRecordName + '_screenshots'",
            accept.once="image/*",
            :maxCount.once="5",
            v-model="formData.screenshots"
          ).image-height-fixed

      .group
        h3 Is your submission available to view anywhere else? Let us know!
        form-field(name="Video", rules="url")
          input-text(
            type="url",
            :name="yearRecordName + '_video'",
            placeholder="Video URL",
            v-model="formData.videoLink"
          )
        form-field(name="GitHub", rules="url")
          input-text(
            type="url",
            :name="yearRecordName + '_github'",
            placeholder="GitHub Repository URL",
            v-model="formData.githubLink"
          )
        form-field(name="AppStore", rules="url")
          input-text(
            type="url",
            :name="yearRecordName + '_appstore'",
            placeholder="App Store URL",
            v-model="formData.appstoreURL"
          )

      .form-color-red
        base-button(@click="deleteYear") Delete
      base-button(
        :disabled="invalid || !changed",
        @click="submit"
      ).btn-cta Save
    .loading(v-else) Loading...
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { WWDCYearInfo } from '@wwdcscholars/cloudkit'
import BaseSection from './BaseSection.vue'
import BaseForm from './BaseForm.vue'
import BaseButton from './BaseButton.vue'
import FormField from './FormField.vue'
import {
  InputImageMultiple,
  InputRadioGroup,
  InputText
} from './inputs'
import { ValidationObserver } from 'vee-validate'

@Component({
  components: {
    BaseSection,
    BaseForm,
    BaseButton,
    FormField,
    InputImageMultiple,
    InputRadioGroup,
    InputText,
    ValidationObserver
  }
})
export default class ProfileSubmission extends Vue {
  @Prop({ type: String, required: true })
  yearRecordName!: string

  @Prop({ type: Object, default: null })
  yearInfo?: WWDCYearInfo

  appliedAsOptions: { label: string; value: string }[] = [
    { label: 'Student', value: 'student' },
    { label: 'STEM', value: 'stem' },
    { label: 'Both', value: 'both' }
  ]

  formData: {
    appliedAs?: string,
    screenshots?: (File | string)[],
    videoLink?: string,
    githubLink?: string,
    appstoreLink?: string
  } = {}

  get screenshots(): string[] {
    return this.yearInfo?.screenshots?.map((asset) => asset.downloadURL) ?? []
  }

  get status(): string | undefined {
    if (!this.yearInfo) return undefined
    if (this.yearInfo.status) return this.yearInfo.status
    return 'pending'
  }

  created() {
    this.yearInfoChanged()
  }

  submit() {

  }

  deleteYear() {

  }

  @Watch('yearInfo')
  yearInfoChanged() {
    this.formData = {
      appliedAs: this.yearInfo?.appliedAs,
      screenshots: this.screenshots,
      videoLink: this.yearInfo?.videoLink,
      githubLink: this.yearInfo?.githubLink,
      appstoreLink: this.yearInfo?.appstoreLink
    }
  }
}
</script>

<style lang="sass" scoped>
.loading
  text-align: center
  font-style: italic
  color: $sch-gray

.header
  display: flex
  justify-content: flex-start
  align-items: center
  margin-bottom: 15px

  h2
    margin-bottom: 0

  .status
    margin-left: 20px
    padding: 2px 10px 4px
    border-radius: $border-radius
    font-size: 0.7em
    color: $white

    &.approved
      background-color: $sch-green

    &.pending
      background-color: $sch-orange

    &.rejected
      background-color: $sch-red2
</style>
