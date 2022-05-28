<template lang="pug">
.container-fluid.form-color-blue
  base-section.section
    h2.color-blue Link your legacy profile

    .link-request
      ValidationObserver(v-slot="{ invalid, changed }", ref="form_find")
        base-form
          .group
            p.
              To link your legacy profile to your iCloud account, you must verify your email address.
              When you click #[i Send Confirmation], we will send an email to the address you specified. Please follow the instructions in the email to link your legacy profile to your iCloud account. In case you need help recovering your account, you can #[nuxt-link(:to.once="contactRoute") contact us here].
            form-field(name="Email", rules="email|required", vid="signedUpBefore_email")
              input-text(
                ref="email",
                type="email",
                name="signedUpBefore_email",
                placeholder="Email",
                :required.once="true",
                v-model="email",
                :disabled="emailSent"
              )
          .group
            base-button(to="/join/signup").btn-secondary Back
            base-button(
              :disabled="invalid || !changed || emailSent",
              @click="sendConfirmation"
            ) Send Confirmation

    .link-error(v-if="requestError")
      hr
      h4 An error occurred
      p {{ requestError }}

    .link-verify(v-if="emailSent")
      hr
      base-form
        .group
          h4 Check your inbox!
          p If we found your legacy profile using the the specified address, we sent you an email. Please follow the instructions in that email to link your existing profile to your iCloud account. If you can't find the email in your inbox, please check your spam folder.
        .group.group-flex-spread
          base-button(@click="resetForm").btn-secondary Try Again
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { RawLocation } from 'vue-router'
import { CloudKit } from '@wwdcscholars/cloudkit'
import {
  BaseSection,
  BaseForm,
  BaseButton,
  FormField,
  InputText
} from '~/components'
import { ValidationObserver } from 'vee-validate'

import { name as authName } from '~/store/auth'
const Auth = namespace(authName)

import { name as joinName } from '~/store/join'
const Join = namespace(joinName)

@Component({
  components: {
    BaseSection,
    BaseForm,
    BaseButton,
    FormField,
    InputText,
    ValidationObserver
  },
  middleware: ['authenticated', 'noprofile']
})
export default class PageJoinLink extends Vue {
  email: string = ''

  requestError: string | null = null
  emailSent: boolean = false

  readonly contactRoute: RawLocation = {
    name: 'contact',
    query: { reason: 'join-link' }
  }

  @Join.Action
  linkRequest!: (email: string) => Promise<void>

  head(): MetaInfo {
    return { title: 'Link your legacy profile | WWDCScholars' }
  }

  resetForm() {
    this.email = ''
    this.requestError = null
    this.emailSent = false
    const emailInput = this.$refs.email as InputText
    emailInput.focus()
  }

  async sendConfirmation() {
    if (!this.email.length) {
      return
    }

    this.requestError = null
    this.$nuxt.$loading.start()

    try {
      await this.linkRequest(this.email)
      this.$nuxt.$loading.finish()
      this.emailSent = true
    } catch (error) {
      console.error(error)
      this.$nuxt.$loading.fail!()
      this.requestError = 'There was a problem sending the verification email. Please try again later.'
    }
  }
}
</script>

<style lang="sass" scoped>
.section
  h4
    color: $sch-blue
    font-weight: 500

  p a
    color: $sch-blue

  hr
    margin-top: 20px

.link-error
  grid-column: span 2
  font-size: 0.9em
  color: $sch-red
</style>
