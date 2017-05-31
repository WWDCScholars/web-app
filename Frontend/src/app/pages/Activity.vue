<template lang="pug">
.page-activity.section-accent-color-orange
  .container.container-outer
    activity-feed
</template>

<script>
import ActivityFeed from '../components/ActivityFeed.vue'

export default {
  name: 'activity',
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
  components: {
    ActivityFeed
  }
}
</script>

<style lang="css">
</style>
