<template lang="pug">
base-section
  .header
    h2 {{ yearRecordName }}
    nuxt-link(
      v-if="yearInfo",
      :class="yearInfo.status",
      :to="profileSubmissionLink(yearInfo)"
    ).status {{ yearInfo.status | uppercase }}

  ValidationObserver(v-slot="{ invalid, changed }", tag="div", ref="form")
    base-form(v-if="yearInfo")
      .group
        h3 Applied As
        form-field(name="Applied As", vid="appliedAs")
          input-radio-group(
            :name="yearRecordName + '_appliedAs'",
            :options.once="appliedAsOptions",
            :required.once="true",
            v-model="formData.appliedAs"
          )

      .group(v-if="yearHasDistinguishedWinnerFeature")
        h3 Were you recognized as a Distinguished Winner?
        form-field(name="Distinguished Winner", vid="isDistinguishedWinner")
          input-checkbox(
            :name="yearRecordName + '_distinguishedWinner'"
            label="I was recognized as a Distinguished Winner",
            :disabled="true",
            :value="formData.isDistinguishedWinner"
          )

      .group
        h3 Describe your winning project in less than 500 characters
        form-field(name="Description", rules="required|max:500", vid="description")
          input-text(
            type="textarea",
            :name="yearRecordName + '_description'",
            maxLength="500",
            required="true",
            v-model="formData.description"
          )

      .group
        h3 Upload some screenshots that showcase your submission
        form-field(name="Screenshots", rules="imageOrString", vid="screenshots")
          input-image-multiple(
            :name="yearRecordName + '_screenshots'",
            accept.once="image/*",
            :maxCount.once="5",
            v-model="screenshots"
          ).image-height-fixed

      .group
        h3 Is your submission available to view anywhere else? Let us know!
        form-field(name="Video", rules="url", vid="videoLink")
          input-text(
            type="url",
            :name="yearRecordName + '_video'",
            placeholder="Video URL",
            v-model="formData.videoLink"
          )
        form-field(name="GitHub", rules="url", vid="githubLink")
          input-text(
            type="url",
            :name="yearRecordName + '_github'",
            placeholder="GitHub Repository URL",
            v-model="formData.githubLink"
          )
        form-field(name="AppStore", rules="url", vid="appstoreLink")
          input-text(
            type="url",
            :name="yearRecordName + '_appstore'",
            placeholder="App Store URL",
            v-model="formData.appstoreLink"
          )

      .group.group-flex-spread
        .form-color-red
          base-button(
            confirm="Do you really wan't to delete this submission? This action cannot be undone.",
            @click="deleteYear"
          ).btn-cta Delete
        base-button(
          :disabled="invalid || !changed",
          @click="submit"
        ).btn-cta Save
    .loading(v-else) Loading...
</template>

<script lang="ts">
import { Component, Prop, Vue, namespace } from 'nuxt-property-decorator'
import { Location } from 'vue-router'
import { Scholar, WWDCYearInfo, WWDCYear, CloudKit } from '@wwdcscholars/cloudkit'
import '~/util/wwdcYear-hasFeature'
import BaseSection from './BaseSection.vue'
import BaseForm from './BaseForm.vue'
import BaseButton from './BaseButton.vue'
import FormField from './FormField.vue'
import {
  InputImageMultiple,
  InputRadioGroup,
  InputCheckbox,
  InputText
} from './inputs'
import { ValidationObserver } from 'vee-validate'
import { handleSave } from '~/util/edit-profile'

import { name as profileName } from '~/store/profile'
const Profile = namespace(profileName)

import { name as yearsName } from '~/store/years'
const Years = namespace(yearsName)

@Component({
  components: {
    BaseSection,
    BaseForm,
    BaseButton,
    FormField,
    InputImageMultiple,
    InputRadioGroup,
    InputCheckbox,
    InputText,
    ValidationObserver
  }
})
export default class ProfileSubmission extends Vue {
  @Prop({ type: String, required: true })
  yearRecordName!: string

  @Prop({ type: String, required: true })
  yearInfoRecordName!: string

  @Profile.Getter
  scholar?: Scholar

  @Years.Getter('byRecordName')
  yearByRecordName!: (recordName: string) => WWDCYear | undefined

  appliedAsOptions: { label: string; value: string }[] = [
    { label: 'Student', value: 'student' },
    { label: 'STEM', value: 'stem' },
    { label: 'Both', value: 'both' }
  ]

  screenshotsValue: (CloudKit.Asset | File)[] = []

  get yearInfo(): WWDCYearInfo | undefined {
    if (!this.scholar || !this.scholar.loadedYearInfos.hasOwnProperty(this.yearRecordName)) return undefined

    return this.scholar?.loadedYearInfos[this.yearRecordName]
  }

  get screenshots(): (string | File)[] {
    return this.screenshotsValue
      ?.map(asset => {
        if (asset['downloadURL']) {
          return asset['downloadURL']
        }
        return asset as File
      }) ?? []
  }

  set screenshots(value: (string | File)[]) {
    this.screenshotsValue = value
      .map(asset => {
        if (asset instanceof File) {
          return asset
        }

        // else string, find original value
        return this.screenshotsValue?.find(value => value && value['downloadURL'] && value['downloadURL'] === asset)
      })
      .filter(element => element !== undefined) as (CloudKit.Asset | File)[]
    this.formData.screenshots = this.screenshotsValue
  }

  get status(): string | undefined {
    if (!this.yearInfo) return undefined
    if (this.yearInfo.status) return this.yearInfo.status
    return 'pending'
  }

  get wwdcYear(): WWDCYear | undefined {
    return this.yearByRecordName(this.yearRecordName)
  }

  get yearHasDistinguishedWinnerFeature(): boolean {
    return this.wwdcYear?.hasFeature('distinguished-winners') ?? false
  }

  get formData(): {
    appliedAs?: ('student' | 'stem' | 'both'),
    isDistinguishedWinner?: boolean,
    description?: string,
    screenshots?: (CloudKit.Asset | File)[],
    videoLink?: string,
    githubLink?: string,
    appstoreLink?: string
  } {
    return {
      appliedAs: this.yearInfo?.appliedAs,
      isDistinguishedWinner: this.yearInfo?.isDistinguishedWinner,
      description: this.yearInfo?.description,
      screenshots: this.screenshotsValue,
      videoLink: this.yearInfo?.videoLink,
      githubLink: this.yearInfo?.githubLink,
      appstoreLink: this.yearInfo?.appstoreLink
    }
  }

  async fetch() {
    await this.$store.dispatch('years/fetchYear', this.yearRecordName)
    await this.$store.dispatch('profile/loadYearInfo', this.yearInfoRecordName)

    this.screenshotsValue = this.yearInfo?.screenshots ?? []
  }

  async submit() {
    if (!this.yearInfo) return

    handleSave(
      this.$refs.form,
      this.formData,
      this.$nuxt,
      async (changes) => {
        await this.saveYearInfo({
          yearInfo: this.yearInfo!,
          changes
        })
      }
    )
  }

  deleteYear() {
    // button handles confirmation dialog
    if (!this.yearInfo) return

    handleSave(
      this.$refs.form,
      this.formData,
      this.$nuxt,
      async () => {
        await this.deleteYearInfo(this.yearInfo!)
      }
    )
  }

  profileSubmissionLink(yearInfo: WWDCYearInfo): Location {
    return {
      name: 's-id-year',
      params: {
        id: yearInfo.scholar.recordName,
        year: yearInfo.year.recordName.substring(5)
      }
    }
  }

  @Profile.Action
  saveYearInfo!: (payload: { yearInfo: WWDCYearInfo, changes: object }) => Promise<void>

  @Profile.Action
  deleteYearInfo!: (yearInfo: WWDCYearInfo) => Promise<void>
}
</script>

<style lang="sass" scoped>
.loading
  text-align: center
  font-style: italic
  color: $label-secondary

.header
  display: flex
  justify-content: flex-start
  align-items: center
  margin-bottom: 15px

  h2
    margin-bottom: 0

  .status
    margin-left: 20px
    padding: 3px 6px
    border-radius: $border-radius
    font-size: 0.6em
    color: $label-inverted
    text-decoration: none

    &.approved
      background-color: $system-green

    &.pending
      background-color: $system-yellow

    &.rejected
      background-color: $system-red

.btn-cta
  grid-column: span 1 !important
</style>
