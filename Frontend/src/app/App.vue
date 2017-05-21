<template lang="pug">
#app
  page-header
    .header-links(slot="right")
      router-link(to="/", :class="routeClass('scholars')"): span Scholars
      router-link(to="/", :class="routeClass('blog')"): span Blog
      router-link(to="/", :class="routeClass('team')"): span Team
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
      return { 'active': (name === this.$route.name) }
    }
  },
  components: {
    PageHeader
  }
}
</script>

<style lang="css">
</style>
