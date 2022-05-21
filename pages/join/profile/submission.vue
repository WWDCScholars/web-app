<template lang="pug">
.container-outer.form-color-purple
  .container-fluid
    .loading-section(v-if="$fetchState.pending")
      loading-spinner

    base-section(v-else)
      h3.color-purple When did you win?

      base-form.year-form
        .group.group-width-50
          p Please select the year you won a WWDC Scholarship or the Swift Student Challenge.
        .group.group-width-50
          form-field(name="Year", vid="year")
            input-select(
              name="year",
              :options="yearOptions",
              v-model="selectedYear"
            )

    profile-form-submission(
      v-if="selectedYear",
      :year="selectedYear",
      v-model="formData",
      v-slot="{ valid }"
    )
      base-button(
        @click="previousClicked"
      ).btn-cta.btn-secondary Previous
      base-button(
        :disabled="!valid",
        @click="continueClicked(valid)"
      ).btn-cta Continue
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { WWDCYear } from '@wwdcscholars/cloudkit'
import {
  ProfileFormSubmission,
  BaseSection,
  BaseForm,
  FormField,
  InputSelect,
  BaseButton,
  LoadingSpinner
} from '~/components'

import { name as joinName } from '~/store/join'
const Join = namespace(joinName)

import { name as yearsName } from '~/store/years'
const Years = namespace(yearsName)

@Component({
  components: {
    ProfileFormSubmission,
    BaseSection,
    BaseForm,
    FormField,
    InputSelect,
    BaseButton,
    LoadingSpinner
  },
  middleware: ['authenticated', 'noprofile']
})
export default class PageJoinProfileSubmission extends Vue {
  @Join.State
  submission?: ProfileFormSubmission.Model

  @Join.Mutation
  updateFields

  @Years.Getter('sortedKeys')
  sortedYearKeys!: string[]

  selectedYear: string | null = null
  formData: ProfileFormSubmission.Model = {}

  get yearOptions(): { label: string; value: string }[] {
    return this.sortedYearKeys
      .reverse()
      .map(year => ({
        label: year,
        value: year
      }))
  }

  async fetch() {
    await this.$store.dispatch('years/queryYears', true)
    const latestYear = this.$store.getters['years/latestYear']
    this.selectedYear = latestYear.recordName
  }

  created() {
    this.formData = {
      appliedAs: this.submission?.appliedAs,
      description: this.submission?.description,
      screenshots: this.submission?.screenshots,
      videoLink: this.submission?.videoLink,
      githubLink: this.submission?.githubLink,
      appstoreLink: this.submission?.appstoreLink,
      acceptanceEmail: this.submission?.acceptanceEmail
    }
  }

  previousClicked() {
    this.$router.back()
  }

  continueClicked(isValid: boolean) {
    this.updateFields({
      section: 'submission',
      value: {
        year: this.selectedYear,
        ...this.formData
      },
      isValid
    })

    this.$router.push('/join/submit')
  }
}
</script>

<style lang="sass" scoped>
.loading-section
  padding: 40px
  text-align: center
  font-size: 32px
  color: $sch-purple

.year-form
  .group
    margin-bottom: 10px
</style>
