<template lang="pug">
profile-form-submission-with-year(
  title="Add Submission",
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

  @Profile.Action
  createYearInfo!: (formData) => Promise<void>

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
