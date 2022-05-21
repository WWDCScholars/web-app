<template lang="pug">
.container-outer
  .container-fluid
    .section
      h2.color-purple Thanks for joining us!
      h3.color-purple We will review your profile as soon as possible
      p.
        In the meantime, you should check out the other great ways to connect with fellow Swift Student Challenge and WWDC Scholarship winners.
        Follow us on Twitter, so you don't miss any announcements, and join the community Discord server to chat with other applicants and winners!

      p.
        You can always check the review status of your submission on #[nuxt-link(to="/profile/submissions") your profile page]. Here, you can also make changes or add another submission at any time.

      .social-links
        a(href="https://twitter.com/WWDCScholars", target="_blank")
          TwitterIcon
        a(href="https://www.wwdcscholars.com/discord", target="_blank")
          DiscordIcon
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import TwitterIcon from '~/assets/images/icon-social-twitter.svg?inline'
import DiscordIcon from '~/assets/images/icon-social-discord.svg?inline'

@Component({
  components: { TwitterIcon, DiscordIcon },
  middleware: ['authenticated', 'profile', 'unapproved']
})
export default class PageJoinThankyou extends Vue {}
</script>

<style lang="sass" scoped>
.container-outer
  position: relative
  text-align: center
  background-image: url("~assets/images/scholars-hero.jpg")
  background-size: cover
  background-position: center bottom

  &:after
    content: ''
    display: block
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-image: linear-gradient($background-tertiary-base 0%, transparent 100%)
    z-index: 100

.container-fluid
  position: relative
  z-index: 200

  p a
    color: $sch-purple

.social-links
  display: flex
  justify-content: center
  margin: 60px 0 35px

  a
    display: block
    padding: 6px
    margin: 0 20px
    line-height: 0px
    color: $sch-purple
    border-radius: $border-radius
    transition: background-color 100ms linear, box-shadow 100ms linear

    svg
      width: 64px
      height: 64px

    &:hover
      background-color: $background-tertiary-elevated
      +shadow
</style>
