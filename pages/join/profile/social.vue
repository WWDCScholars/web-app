<template lang="pug">
.container-outer.form-color-purple
  .container-fluid
    profile-form-social(
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
import {
  ProfileFormSocial,
  BaseButton
} from '~/components'

import { name as joinName } from '~/store/join'
const Join = namespace(joinName)

@Component({
  components: {
    ProfileFormSocial,
    BaseButton
  },
  middleware: ['authenticated', 'noprofile']
})
export default class PageJoinProfileSocial extends Vue {
  @Join.State
  social?: ProfileFormSocial.Model

  @Join.Mutation
  updateFields

  formData: ProfileFormSocial.Model = {}

  created() {
    this.formData = {
      twitter: this.social?.twitter,
      github: this.social?.github,
      discord: this.social?.discord,
      linkedin: this.social?.linkedin,
      imessage: this.social?.imessage,
      facebook: this.social?.facebook,
      website: this.social?.website
    }
  }

  previousClicked() {
    this.$router.back()
  }

  continueClicked(isValid: boolean) {
    this.updateFields({
      section: 'social',
      value: this.formData,
      isValid
    })

    this.$router.push('/join/profile/submission')
  }
}
</script>

<style lang="sass" scoped></style>
