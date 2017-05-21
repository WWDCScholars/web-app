<template lang="pug">
#app
  page-header
    .header-links(slot="right")
      router-link(:to="{ name: 'scholars' }", :class="routeClass('scholars')"): span Scholars
      router-link(:to="{ name: 'blog' }", :class="routeClass('blog')"): span Blog
      router-link(:to="{ name: 'team' }", :class="routeClass('team')"): span Team
      a(href="#"): span My Profile

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
