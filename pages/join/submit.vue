<template lang="pug">
.container-outer.form-color-purple
  modal-loading-spinner(
    v-if="isSubmitInProgress",
    title="Beaming your profile to space...",
    subtitle="Depending on your internet connection, this might take a while."
  )

  .container-fluid
    base-section
      h3(v-if="isParentalConsentRequired === true").color-purple Last, we have to go over a few formalities
      h3(v-else).color-purple Last, we have to go over a formality

      ValidationObserver(v-slot="{ valid }", ref="form-join-submit")
        base-form
          .group(v-if="isParentalConsentRequired === true")
            h3.
              Since you're below 18 years of age, your parents/legally authorized chaperons have to consent to the public display of your information on our website and our iOS app.

            form-field(name="Parental Consent", :rules="{ required: { allowFalse: false } }", vid="parentalConsent")
              input-checkbox(
                name="parentalConsent",
                label="I confirm that my parents/legally authorized chaperons have allowed me to register on WWDCScholars and that they're ok with the public display of my submitted information.",
                v-model="parentalConsent"
              )

          .group
            h3 In order to sign up you have to accept our privacy policy.

            form-field(name="Privacy Policy", :rules="{ required: { allowFalse: false } }", vid="gdprConsent")
              input-checkbox(
                name="gdprConsent",
                label="I accept the <a href=\"/privacy\" target=\"_blank\">privacy policy</a>",
                v-model="gdprConsent"
              )

          .group.group-flex-spread
            base-button(
              @click="previousClicked"
            ).btn-cta.btn-secondary Previous
            base-button(
              :disabled="!valid || !isFormComplete || isSubmitInProgress",
              @click="submitClicked"
            ).btn-cta Submit
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import {
  BaseSection,
  BaseForm,
  BaseButton,
  FormField,
  InputCheckbox,
  ModalLoadingSpinner
} from '~/components'
import { ValidationObserver } from 'vee-validate'

import { name as joinName } from '~/store/join'
const Join = namespace(joinName)

@Component({
  components: {
    BaseSection,
    BaseForm,
    BaseButton,
    FormField,
    InputCheckbox,
    ModalLoadingSpinner,
    ValidationObserver
  },
  middleware: ['authenticated', 'noprofile']
})
export default class PageJoinSubmit extends Vue {
  @Join.Getter
  isParentalConsentRequired?: boolean

  @Join.Getter
  isFormComplete!: boolean

  @Join.Action
  submitForm!: () => Promise<void>

  parentalConsent: boolean = false
  gdprConsent: boolean = false
  isSubmitInProgress: boolean = false

  head(): MetaInfo {
    return { title: 'Submit your profile | WWDCScholars' }
  }

  previousClicked() {
    this.$router.back()
  }

  async submitClicked() {
    if (this.isSubmitInProgress) return

    this.isSubmitInProgress = true
    try {
      await this.submitForm()
      this.$router.push('/join/thankyou')
    } catch (error) {
      this.$router.push('/join/error')
    } finally {
      this.isSubmitInProgress = false
    }
  }
}
</script>

<style lang="sass" scoped></style>
