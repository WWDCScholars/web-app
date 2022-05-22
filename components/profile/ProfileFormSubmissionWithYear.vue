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
    v-model="formDataValue",
    v-slot="{ valid }"
  )
    slot(v-bind:valid="valid")
</template>

<script lang="ts">
import { Component, ModelSync, Prop, Watch, Vue, namespace } from 'nuxt-property-decorator'
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

  @Years.Getter('sortedKeys')
  sortedYearKeys!: string[]

  selectedYear: string | null = null

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

  @Watch('selectedYear')
  onSelectedYearChanged(value) {
    this.$emit('change:selectedYear', value)
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
