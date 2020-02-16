<template lang="pug">
.container-outer.form-color-purple
  navigation-tab-bar
    nuxt-link(to="/profile") Basic
    nuxt-link(to="/profile/social") Social
    nuxt-link(to="/profile/submissions") Submissions
    nuxt-link(to="/profile/account") Account

  nuxt-child
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { NavigationTabBar } from '~/components'

@Component({
  middleware: 'authenticated',
  components: { NavigationTabBar }
})
export default class PageProfile extends Vue {
  async fetch({ store }) {
    const userScholarReference = store.state.auth.userScholarReference
    if (!userScholarReference) return

    await store.dispatch('scholars/fetchScholar', userScholarReference.recordName)
  }
}
</script>
