<template lang="pug">
li.tweet
  img.tweet-image(:src="tweet.user.profile_image_url_https")
  .tweet-content
    .tweet-meta
      a(:href="'https://twitter.com/' + tweet.user.screen_name", target="_blank").tweet-user
        .tweet-name {{ tweet.user.name }}
        .tweet-handle @{{ tweet.user.screen_name }}
      span ·
      a(:href="url", target="_blank"): timeago(:since="tweet.created_at").tweet-datetime
    .tweet-text(v-html="text")
    .tweet-media(v-if="tweet.entities.media")
      .tweet-media-image(v-for="m in media", :class="{ 'tweet-media-large': media.length === 1 }")
        a(:href="m.url", target="_blank"): img(:src="m.image")
</template>

<script>
export default {
  name: 'tweet',
  props: {
    tweet: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      media: [],
      text: ''
    }
  },
  computed: {
    url () {
      return 'https://twitter.com/-/status/' + this.tweet.id_str
    }
  },
  created () {
    this.parseText()
    if (this.tweet.entities.media) { this.parseMedia() }
  },
  mounted () {},
  methods: {
    parseMedia () {
      let mediaEnts = this.tweet.entities.media
      mediaEnts.forEach((media) => {
        if (media.type !== 'photo') { return }

        var ending = ''
        if (mediaEnts.length === 1) ending = '' // use default (medium) if only one media object is present
        else if (media.sizes.thumb) ending = ':thumb'
        else if (media.sizes.small) ending = ':small'
        else if (media.sizes.medium) ending = ':medium'
        else if (media.sizes.large) ending = ':large'

        this.media.push({
          url: media.url,
          image: media.media_url_https + ending
        })

        // remove link from tweet body
        this.text = this.text.replace(media.url, '')
      })
    },
    parseText () {
      var text = this.tweet.text
      text = text.replace(/(#\S+)/g, '<a href="https://twitter.com/hashtag/$1">$1</a>').replace('hashtag/#', 'hashtag/')

      this.text = text
    }
  },
  components: {}
}
</script>

<style lang="sass">
@import "~style.module/tweet"
</style>
