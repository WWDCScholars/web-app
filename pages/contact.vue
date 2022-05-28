<template lang="pug">
.container-fluid.form-color-purple
  base-section.section
    h2 Contact us

    form(name="contact").contact-form
      ValidationObserver(v-slot="{ invalid, reset }")
        base-form
          .group
            h3 Please select the reason for your inquiry
            form-field(name="Reason", rules="required", vid="reason")
              input-select(
                name="reason",
                :options="reasonOptions",
                v-model="reason"
              )

          .group
            h3 Fill in the fields below and submit. We will respond to you as soon as possible.
            form-field(name="Name", rules="required", vid="name")
              input-text(
                type="text",
                name="name",
                placeholder="Your Name",
                required="true",
                v-model="name"
              )
            form-field(name="Email", rules="email|required", vid="email")
              input-text(
                type="email",
                name="email",
                placeholder="Your Email Address",
                required="true",
                v-model="email"
              )
            form-field(name="Inquiry", rules="required", vid="inquiry")
              input-text(
                type="textarea",
                name="inquiry",
                placeholder="Your Inquiry",
                required="true",
                v-model="inquiry"
              ).input-textarea
          .group
            base-button(
              :disabled="invalid",
              @click="submit(reset)"
            ).btn-cta Submit

    .contact-error(v-if="contactError")
      hr
      h4 An error occurred
      p {{ contactError }}

    .contact-success(v-if="contactSuccess")
      hr
      h4 Submitted
      p We got your inquiry, expect a response soon.
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import {
  BaseSection,
  BaseForm,
  BaseButton,
  FormField,
  InputText,
  InputSelect
} from '~/components'
import { ValidationObserver } from 'vee-validate'

@Component({
  components: {
    BaseSection,
    BaseForm,
    BaseButton,
    FormField,
    InputText,
    InputSelect,
    ValidationObserver
  }
})
export default class PageContact extends Vue {
  reason: string = ''
  name: string = ''
  email: string = ''
  inquiry: string = ''

  contactError: string | null = null
  contactSuccess: boolean = false

  readonly reasonOptions: InputSelect.Options = [
    { label: 'General', value: 'general' },
    { label: 'Issue during signup', value: 'join-error' },
    { label: 'Link existing account', value: 'join-link' }
  ]

  head(): MetaInfo {
    return { title: 'Contact | WWDCScholars' }
  }

  created() {
    let reasonIndex: number | undefined
    if (this.$route.query && this.$route.query.reason) {
      reasonIndex = this.reasonOptions.findIndex(v => v.value === this.$route.query.reason)
    } else {
      reasonIndex = this.reasonOptions.findIndex(v => v.value === 'general')
    }
    if (reasonIndex >= 0) {
      this.reason = this.reasonOptions[reasonIndex].value
    }
  }

  resetForm() {
    this.reason = ''
    this.name = ''
    this.email = ''
    this.inquiry = ''
  }

  async submit(resetValidation: () => void) {
    this.$nuxt.$loading.start()
    try {
      await this.$axios.post(
        '/',
        this.encode({
          'form-name': 'contact',
          'reason': this.reason,
          'name': this.name,
          'email': this.email,
          'inquiry': this.inquiry
        })
      )
      this.$nuxt.$loading.finish!()
      this.resetForm()
      resetValidation()
    } catch (error) {
      this.$nuxt.$loading.fail!()
      console.error(error)
    }
  }

  encode(data: { [key: string]: string }): string {
    return Object
      .keys(data)
      .map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
      )
      .join('&')
  }
}
</script>

<style lang="sass" scoped>
.input-textarea ::v-deep textarea
  height: 5em

.section
  hr
    margin-top: 20px

  h4
    color: $sch-purple
    font-weight: 500

.contact-error
  color: $sch-red
</style>
