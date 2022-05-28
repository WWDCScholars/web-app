<template lang="pug">
.container-outer.form-color-purple
  .container-fluid
    profile-form-basic(
      v-model="formData",
      v-slot="{ valid }"
    )
      base-button(
        to="/join/link"
      ).btn-cta.btn-secondary Previous
      base-button(
        :disabled="!valid",
        @click="continueClicked(valid)"
      ).btn-cta Continue
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import {
  ProfileFormBasic,
  BaseButton
} from '~/components'

import { name as joinName } from '~/store/join'
const Join = namespace(joinName)

@Component({
  components: {
    ProfileFormBasic,
    BaseButton
  },
  middleware: ['authenticated', 'noprofile']
})
export default class PageJoinProfileIndex extends Vue {
  @Join.State
  profile?: ProfileFormBasic.Model

  @Join.Mutation
  updateFields

  formData: ProfileFormBasic.Model = {}

  head(): MetaInfo {
    return { title: 'Join | WWDCScholars' }
  }

  created() {
    this.formData = {
      profilePicture: this.profile?.profilePicture,
      givenName: this.profile?.givenName,
      familyName: this.profile?.familyName,
      email: this.profile?.email,
      birthday: this.profile?.birthday,
      gender: this.profile?.gender,
      location: this.profile?.location,
      biography: this.profile?.biography
    }
  }

  continueClicked(isValid: boolean) {
    this.updateFields({
      section: 'profile',
      value: this.formData,
      isValid
    })

    this.$router.push('/join/profile/social')
  }
}
</script>

<style lang="sass" scoped></style>
