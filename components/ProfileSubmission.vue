<template lang="pug">
base-section
  h2 {{ yearRecordName }}

  base-form(v-if="yearInfo")
    .group
      h3 Applied As
      form-field
        input-radio-group(
            :name="yearRecordName + '_appliedAs'",
            :options.once="appliedAsOptions",
            :required.once="true",
            :value="yearInfo.appliedAs"
          )

    .group
      h3 Screenshots
      form-field
        input-image(
          :name="yearRecordName + '_screenshots'",
          accept="image/*",
          multiple="true",
          maxCount="5",
          :value="screenshots"
        ).image-height-fixed

    .group
      h3 Is your submission available to view anywhere else? Let us know!
      form-field
        input-text(
          type="url",
          :name="yearRecordName + '_video'",
          placeholder="Video URL",
          :value="yearInfo.videoLink"
        )
      form-field
        input-text(
          type="url",
          :name="yearRecordName + '_github'",
          placeholder="GitHub Repository URL",
          :value="yearInfo.githubLink"
        )
      form-field
        input-text(
          type="url",
          :name="yearRecordName + '_appstore'",
          placeholder="App Store URL",
          :value="yearInfo.appstoreURL"
        )

    .form-color-red: base-button Delete
    base-button.btn-cta Save
  .loading(v-else) Loading...
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { WWDCYearInfo } from '@wwdcscholars/cloudkit'
import BaseSection from './BaseSection.vue'
import BaseForm from './BaseForm.vue'
import BaseButton from './BaseButton.vue'
import FormField from './FormField.vue'
import {
  InputImage,
  InputRadioGroup,
  InputText
} from './inputs'

@Component({
  components: {
    BaseSection,
    BaseForm,
    BaseButton,
    FormField,
    InputImage,
    InputRadioGroup,
    InputText
  }
})
export default class PageProfileSocial extends Vue {
  @Prop({ type: String, required: true })
  yearRecordName!: string

  @Prop({ type: Object, default: null })
  yearInfo?: WWDCYearInfo

  appliedAsOptions: { label: string; value: string }[] = [
    { label: 'Student', value: 'student' },
    { label: 'STEM', value: 'stem' },
    { label: 'Both', value: 'both' }
  ]

  get screenshots(): string[] {
    return this.yearInfo?.screenshots?.map((asset) => asset.downloadURL) ?? []
  }
}
</script>

<style lang="sass" scoped>
.loading
  text-align: center
  font-style: italic
  color: $sch-gray
</style>
