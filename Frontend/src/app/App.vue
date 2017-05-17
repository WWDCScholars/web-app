<template lang="pug">
#app
  page-header
    .auth-button(slot="right")
      #apple-sign-in-button
      #apple-sign-out-button

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
  methods: {},
  components: {
    PageHeader
  }
}
</script>

<style lang="css">
</style>
