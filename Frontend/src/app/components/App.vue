<template lang="pug">
#app
  page-header

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
