<template lang="pug">
.activity-feed
  ul
    tweet(v-for="tweet in tweets", :tweet="tweet")
</template>

<script>
import Tweet from './Tweet.vue'
import Twitter from '../modules/twitter'
let T = new Twitter()

export default {
  name: 'activity-feed',
  props: {},
  data () {
    return {
      tweets: []
    }
  },
  computed: {},
  created () {},
  async mounted () {
    let response = await T.searchTweets('#WWDCScholars OR from:@tim_cook -filter:retweets')
    this.tweets = response.statuses
  },
  methods: {},
  components: {
    Tweet
  }
}
</script>

<style lang="sass">
@import "~style.module/activity-feed"
</style>
