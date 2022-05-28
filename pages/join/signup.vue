<template lang="pug">
.container-fluid.form-color-blue
  base-section.section
    h2.color-blue Join the WWDCScholars community!
    h3.color-blue Did you sign up for a WWDCScholars profile before 2017 using email and password credentials?

    p.
      If you did, please select #[i Signed up before] and provide the email address used for your legacy account, so we can link it with your iCloud account and display past WWDC Scholarships on your profile.
    p.
      If you never had a WWDCScholars profile before, select #[i First-time Scholar].

    base-form.join-form
      base-button(to="/join/link").btn-secondary Signed up before
      base-button(to="/join/profile") First-time Scholar
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import {
  BaseSection,
  BaseForm,
  BaseButton
} from '~/components'

@Component({
  components: {
    BaseSection,
    BaseForm,
    BaseButton
  },
  middleware: ['authenticated', 'noprofile']
})
export default class PageJoinSignup extends Vue {
  head(): MetaInfo {
    return { title: 'Join | WWDCScholars' }
  }
}
</script>

<style lang="sass" scoped>
.join-form
  margin-top: 20px
</style>
