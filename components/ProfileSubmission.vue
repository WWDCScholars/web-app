<template lang="pug">
base-section
  h2 WWDC {{ year }}

  base-form
    .group
      h3 Applied As
      form-field
        input-radio-group(
            name="appliedAs",
            :options.once="['Student', 'STEM', 'Both']",
            required="true",
            v-model="appliedAs"
          )

    .group
      h3 Screenshots
      form-field
        input-image(
          name="screenshots",
          accept="image/*",
          multiple="true",
          maxCount="5"
        ).image-height-fixed

    .group
      h3 Is your submission available to view anywhere else? Let us know!
      form-field
        input-text(
          type="url",
          name="youtube",
          placeholder="YouTube Video URL",
          v-model="youtube"
        )
      form-field
        input-text(
          type="url",
          name="github",
          placeholder="GitHub Repository URL",
          v-model="github"
        )
      form-field
        input-text(
          type="url",
          name="appstore",
          placeholder="App Store URL",
          v-model="appstore"
        )

    base-button.btn-cta Save
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
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
  @Prop({ required: true })
  year!: string

  appliedAs: string = ''
  screenshots: File[] = []
  youtube: string = ''
  github: string = ''
  appstore: string = ''
}
</script>

<style lang="sass" scoped></style>
