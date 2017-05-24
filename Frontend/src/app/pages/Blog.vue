<template lang="pug">
.page-blog.section-accent-color-red
</template>

<script>
export default {
  name: 'blog',
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
