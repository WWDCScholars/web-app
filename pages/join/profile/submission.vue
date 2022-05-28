<template lang="pug">
.container-outer.form-color-purple
  profile-form-submission-with-year(
    v-model="formData",
    @change:selectedYear="selectedYear = $event",
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
import { MetaInfo } from 'vue-meta'
import { WWDCYear } from '@wwdcscholars/cloudkit'
import {
  ProfileFormSubmissionWithYear,
  BaseButton
} from '~/components'

import { name as joinName } from '~/store/join'
const Join = namespace(joinName)

import { name as yearsName } from '~/store/years'
const Years = namespace(yearsName)

@Component({
  components: {
    ProfileFormSubmissionWithYear,
    BaseButton
  },
  middleware: ['authenticated', 'noprofile']
})
export default class PageJoinProfileSubmission extends Vue {
  @Join.State
  submission?: ProfileFormSubmissionWithYear.Model

  @Join.Mutation
  updateFields

  formData: ProfileFormSubmissionWithYear.Model = {}
  selectedYear: string | null = null

  head(): MetaInfo {
    return { title: 'Join | WWDCScholars' }
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
    if (!this.selectedYear) return

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
