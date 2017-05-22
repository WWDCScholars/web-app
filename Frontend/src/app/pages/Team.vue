<template lang="pug">
.page-team
</template>

<script>
export default {
  name: 'team',
  store: ['auth'],
  data () {
    return {}
  },
  computed: {},
  created () {
    if (this.$store.auth.loaded === true) {
      this.onCloudKitInitialized()
    } else {
      this.$store.auth.on('CloudKit_Initialized', this.onCloudKitInitialized)
    }
  },
  mounted () {},
  methods: {
    onCloudKitInitialized () {}
  },
  components: {}
}
</script>

<style lang="css">
</style>
