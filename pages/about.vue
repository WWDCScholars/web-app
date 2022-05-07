<template lang="pug">
.container-outer
  .container-fluid
    h2.color-green About WWDC#[span Scholars]
    h3.
      Learn about our community of scholarship winners, who we are and how you can
      get involved.

    .team-section
      .team-picture
        img(src="/images/team-members.jpg")
        .title WWDC#[span Scholars] Team

      .team-cards
        team-card(
          v-for="member in teamMembers",
          :key="member.recordName"
          :name="member.name",
          :age="member.birthday | yearDifference",
          :image="member.picture.downloadURL",
          :scholar="member.scholar"
        ) {{ member.biography }}

    .team-section
      .team-picture
        img(src="/images/team-scholars.jpg")
        .title WWDCScholarships

      base-section
        .subsection(
          v-for="item in faqItems",
          :key="item.recordName"
        )
          h4.color-red {{ item.question }}
          p(v-if="item.comment", v-html="replaceMarkdown(item.comment)").comment
          p(v-html="replaceMarkdown(item.answer)")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { namespace } from 'vuex-class'
import { TeamMember, FAQItem } from '@wwdcscholars/cloudkit'
import {
  BaseSection,
  TeamCard
} from '~/components'
import { replaceLinebreaksAndLinks } from '~/util/markdown'

import { name as aboutName } from '~/store/about'
const About = namespace(aboutName)

@Component({
  components: {
    BaseSection,
    TeamCard
  }
})
export default class PageAbout extends Vue {
  @About.State
  teamMembers!: TeamMember[]

  @About.State
  faqItems!: FAQItem[]

  head(): MetaInfo {
    return { title: 'About | WWDCScholars' }
  }

  async fetch() {
    await Promise.all([
      this.$store.dispatch('about/queryTeamMembers'),
      this.$store.dispatch('about/queryFAQItems')
    ])
  }

  replaceMarkdown(markdown: string): string {
    return replaceLinebreaksAndLinks(markdown)
  }
}
</script>

<style lang="sass" scoped>
.container-fluid
  padding-top: 80px

  +for-phone-only
    padding-top: 60px

h2
  font-size: 2.4em
  font-weight: 700
  text-align: center
  margin-bottom: 30px

  span
    font-weight: 500

h3
  font-size: 1.6em
  font-weight: 500
  text-align: center
  margin-bottom: 80px

+for-phone-only
  h2
    font-size: 2em

  h3
    font-size: 1.3em
    margin-bottom: 60px

.subsection
  ::v-deep a
    color: inherit

  .comment
    font-size: 0.8em
    font-style: italic
    margin-bottom: 0px

.team-picture
  position: relative

  img
    width: 100%
    border-radius: $border-radius-large
    +shadow

    +for-phone-only
      border-radius: 0

  .title
    position: absolute
    bottom: 8%
    left: 4%
    font-size: 2.3em
    font-weight: 700
    //picture bg is static and needs bright contrast
    color: white

    span
      font-weight: 500

    +for-phone-only
      font-size: 1.2em

.team-section
  margin-bottom: 40px

  &:last-of-type
    margin-bottom: 0

  .team-picture
    margin-bottom: 40px

.team-cards
  display: grid
  grid-template-columns: 1fr
  grid-gap: 40px

  +for-tablet-landscape-up
    grid-template-columns: 1fr 1fr
</style>
