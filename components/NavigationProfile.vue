<template lang="pug">
navigation-tab-bar.form-color-green
  nuxt-link(to="/profile") Basic
  nuxt-link(to="/profile/social") Social
  nuxt-link(to="/profile/submissions") Submissions
  nuxt-link(to="/profile/account") Account
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { NavigationTabBar } from '~/components'

@Component({
  components: { NavigationTabBar }
})
export default class NavigationProfile extends Vue {}
</script>
