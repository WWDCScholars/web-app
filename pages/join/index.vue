<template lang="pug">
.container-fluid
  base-section
    h2.color-blue Welcome to WWDCScholars!
    h3.color-blue Sign in with your Apple ID to showcase your winning submission

    p.
      First of all – congratulations! Whether you're a first-time
      winner or a returning Scholar, you've achieved something
      special and should be very proud!
    p.
      Now it's time you showcase your talent and connect with the
      other winners worldwide! Sign in with your Apple ID below to
      get started building your profile. We use iCloud for
      authentication, so we do not get to see any of your login
      details as everything is handled between Apple and you.
    p.
      If you are new to the WWDC Swift Student Challenge / WWDC
      scholarships and would like to learn more, we recommend
      visiting our #[nuxt-link(to="/about") about page].

    .cta-container
      button(@click="signIn").btn-sign-in Sign in with Apple ID

    hr

    .notes
      h3 Recover your legacy account
      p.
        Did you sign up for a WWDCScholars profile before 2017 using
        email and password credentials? We switched to iCloud
        authentication, which requires linking your legacy profile
        with your iCloud account to make your profile public again.
        The process only takes a few minutes. Sign in above and
        follow the instructions to recover your legacy account.

      h3 Accept our privacy policy
      p.
        Did you sign up before May 2018 and can't find your profile
        on our website or app anymore? Due to changes in government
        regulations, we must obtain consent for the public display of
        your information. You can sign in above to accept our privacy
        policy and update your profile at any time.
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { BaseSection } from '~/components'

import * as auth from '~/store/auth'
const Auth = namespace(auth.name)

@Component({
  middleware: 'anonymousOrProfile',
  components: { BaseSection }
})
export default class PageJoinIndex extends Vue {
  @Auth.Action
  getSignInURL!: () => Promise<string | undefined>

  head(): MetaInfo {
    return { title: 'Join the WWDCScholars community!' }
  }

  async signIn() {
    const url = await this.getSignInURL()
    if (!url) {
      return
    }

    window.location.href = url
  }
}
</script>

<style lang="sass" scoped>
.section
  h2
    text-align: center
    font-size: 2em
    font-weight: 600
    margin-bottom: 30px

  h3
    font-size: 1.4em
    font-weight: 500

  p
    margin: 0 auto 16px

    a
      color: $sch-blue

  .cta-container
    text-align: center
    margin-top: 50px

  hr
    margin: 40px -15px 20px

  .notes
    color: $label-secondary

    h3
      font-size: 1.1em
      font-weight: 500
      margin: 20px 0 8px

    p
      font-size: 0.8em

  .btn-sign-in
    display: inline-block
    padding: 10px 20px
    font-weight: 500
    color: $label-primary
    background-color: $background-primary-base
    border: 1.5px solid $label-primary
    border-radius: $border-radius
    text-decoration: none
</style>
