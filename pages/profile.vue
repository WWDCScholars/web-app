<template lang="pug">
.container-outer.form-color-purple(v-if="!$fetchState.pending && scholar")
  navigation-tab-bar
    nuxt-link(to="/profile") Basic
    nuxt-link(to="/profile/social") Social
    nuxt-link(to="/profile/submissions") Submissions
    nuxt-link(to="/profile/account") Account

  .container-fluid
    base-section(v-if="!scholar.gdprConsentAt").gdpr-consent-missing
      base-form.form-color-white
        .group
          h3 Accept our privacy policy
          p.
            Due to changes in government regulations, we must obtain renewed consent for the public display of your information. Therefore, you need to accept #[nuxt-link(to="/privacy") our privacy policy] using the button below to make your profile publicly visible again. Should you wish to delete your WWDCScholars profile, you can do so in #[nuxt-link(to="/profile/account") the account section].

        .group.group-flex-spread
          base-button(@click="acceptPrivacyPolicy").btn-cta I accept the privacy policy

  nuxt-child
.container-outer(v-else-if="$fetchState.pending")
  .container-fluid
    .loading-section
      loading-spinner()
.container-outer(v-else)
  .container-fluid
    .error-section
      h2.color-purple Looks like you don't have a profile yet
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { namespace } from 'vuex-class'
import { Scholar } from '@wwdcscholars/cloudkit'
import {
  BaseSection,
  BaseForm,
  BaseButton,
  LoadingSpinner,
  NavigationTabBar
} from '~/components'

import { name as authName } from '~/store/auth'
const Auth = namespace(authName)

import { name as profileName } from '~/store/profile'
const Profile = namespace(profileName)

@Component({
  middleware: ['authenticated', 'profile'],
  components: {
    BaseSection,
    BaseForm,
    BaseButton,
    LoadingSpinner,
    NavigationTabBar
  }
})
export default class PageProfile extends Vue {
  @Auth.State('pendingPromise')
  authPendingPromise!: Promise<void>

  @Profile.Getter
  scholar?: Scholar

  @Profile.Action
  saveGDPRConsent!: () => Promise<void>

  head(): MetaInfo {
    return { title: 'Profile | WWDCScholars' }
  }

  async fetch() {
    await this.authPendingPromise
    await this.$store.dispatch('profile/loadScholar')
  }

  async acceptPrivacyPolicy() {
    this.$nuxt.$loading.start()
    await this.saveGDPRConsent()
    this.$nuxt.$loading.finish()
  }
}
</script>

<style lang="sass" scoped>
.error-section
  padding: 40px 10px
  text-align: center

  a
    color: $label-primary

.loading-section
  padding: 40px 10px
  text-align: center
  font-size: 32px
  color: $sch-purple

.gdpr-consent-missing
  background-color: $sch-purple
  color: $system-white

  a
    color: $system-white

  .group h3
    font-size: 1.4em
    font-weight: 600
</style>
