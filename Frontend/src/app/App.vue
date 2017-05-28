<template lang="pug">
#app
  page-header
    .header-links(slot="right")
      router-link(:to="{ name: 'scholars' }", :class="routeClass('scholars')").color-purple: span Scholars
      router-link(:to="{ name: 'activity' }", :class="routeClass('activity')").color-orange: span Activity
      router-link(:to="{ name: 'blog' }", :class="routeClass('blog')").color-red1: span Blog
      router-link(:to="{ name: 'store' }", :class="routeClass('store')").color-blue1: span Store
      router-link(:to="{ name: 'team' }", :class="routeClass('team')").color-red2: span Team
      a(href="#").color-green: span My Profile

  router-view
</template>

<script>
import { PageHeader } from 'components'

export default {
  name: 'App',
  store: [],
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {
    routeClass (name) {
      let r = this.$route
      return { 'active': (name === r.name || name === r.meta.menu) }
    }
  },
  components: {
    PageHeader
  }
}
</script>

<style lang="css">
</style>
