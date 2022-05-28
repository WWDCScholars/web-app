<template lang="pug">
profile-form-submission-with-year(
  title="Add Submission",
  :filterYears="filterYears",
  v-model="formData",
  @change:selectedYear="selectedYear = $event",
  v-slot="{ valid }"
)
  base-button(
    to="/profile/submissions"
  ).btn-cta.btn-secondary Cancel
  base-button(
    :disabled="!valid",
    @click="submitClicked"
  ).btn-cta Submit
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import {
  ProfileFormSubmissionWithYear,
  BaseButton
} from '~/components'
import { Scholar } from '@wwdcscholars/cloudkit'

import { name as profileName } from '~/store/profile'
const Profile = namespace(profileName)

@Component({
  components: {
    ProfileFormSubmissionWithYear,
    BaseButton
  }
})
export default class PageProfileSubmissionsNew extends Vue {
  formData: ProfileFormSubmissionWithYear.Model = {}
  selectedYear: string | null = null

  @Profile.Getter
  scholar?: Scholar

  @Profile.Action
  createYearInfo!: (formData) => Promise<void>

  get filterYears(): string[] | undefined {
    if (!this.scholar || !this.scholar.wwdcYears) {
      return undefined
    }

    return this.scholar.wwdcYears
      .map(y => y.recordName)
  }

  async submitClicked() {
    if (!this.selectedYear) return

    this.$nuxt.$loading.start()
    await this.createYearInfo({
      year: this.selectedYear,
      ...this.formData
    })
    this.$nuxt.$loading.finish()

    this.$router.push('/profile/submissions')
  }
}
</script>

<style lang="sass" scoped></style>
