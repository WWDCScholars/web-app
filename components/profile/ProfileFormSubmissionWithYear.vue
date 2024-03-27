<template lang="pug">
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
    :features="yearFeatures",
    v-model="formDataValue",
    v-slot="{ valid }"
  )
    slot(v-bind:valid="valid")
</template>

<script lang="ts">
import { Component, ModelSync, Prop, Watch, Vue, namespace } from 'nuxt-property-decorator'
import { WWDCYear } from '@wwdcscholars/cloudkit'
import {
  BaseSection,
  BaseForm,
  FormField,
  InputSelect,
  LoadingSpinner
} from '~/components'
import ProfileFormSubmission from './ProfileFormSubmission.vue'

import { name as yearsName } from '~/store/years'
const Years = namespace(yearsName)

@Component({
  components: {
    BaseSection,
    BaseForm,
    FormField,
    InputSelect,
    LoadingSpinner,
    ProfileFormSubmission
  }
})
class ProfileFormSubmissionWithYear extends Vue {
  @ModelSync('formData', 'change:formData')
  readonly formDataValue!: ProfileFormSubmissionWithYear.Model

  @Prop({ type: String, required: false })
  title?: string

  @Prop({ type: Array, default: () => [] })
  filterYears!: string[]

  @Years.Getter('sortedKeys')
  sortedYearKeys!: string[]

  @Years.Getter('byRecordName')
  yearByRecordName!: (recordName: string) => WWDCYear | undefined

  selectedYear: string | null = null
  yearFeatures: string[] = []

  get yearOptions(): { label: string; value: string }[] {
    return this.sortedYearKeys
      .filter(year => !this.filterYears.includes(year))
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

  @Watch('selectedYear')
  onSelectedYearChanged(selectedYear: string) {
    const yearInfo = this.yearByRecordName(selectedYear)
    if (!yearInfo) {
      return
    }

    this.yearFeatures = yearInfo.features ?? []
    this.$emit('change:selectedYear', yearInfo.recordName)
  }
}

namespace ProfileFormSubmissionWithYear {
  export type Model = ProfileFormSubmission.Model
}

export default ProfileFormSubmissionWithYear
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
