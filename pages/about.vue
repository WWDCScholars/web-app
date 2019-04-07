<template lang="pug">
.container-outer
  .container-fluid
    h2.color-green About WWDC#[span Scholars]
    h3.
      Learn about our community of scholarship winners, who we are and how you can
      get involved.

    .team-section
      .team-picture
        img(src="~assets/images/team-members.jpg")
        .title WWDC#[span Scholars] Team

      .team-cards
        team-card(name="Andrew Walker", age="22", image="/andrew.jpg").
          Andrew has been working on iOS applications for 4 1/2 years. He
          recently interned at Apple after attending WWDC as a scholarship
          winner for three consecutive years.
        
        team-card(name="Matthijs Logemann", age="19", image="/andrew.jpg").
          Andrew has been working on iOS applications for 4 1/2 years. He
          recently interned at Apple after attending WWDC as a scholarship
          winner for three consecutive years.
        
        team-card(name="Sam Eckert", age="18", image="/andrew.jpg").
          Andrew has been working on iOS applications for 4 1/2 years. He
          recently interned at Apple after attending WWDC as a scholarship
          winner for three consecutive years.

        team-card(name="Oliver Binns", age="24", image="/andrew.jpg").
          Andrew has been working on iOS applications for 4 1/2 years. He
          recently interned at Apple after attending WWDC as a scholarship
          winner for three consecutive years.

        team-card(name="Moritz Sternemann", age="22", image="/andrew.jpg").
          Andrew has been working on iOS applications for 4 1/2 years. He
          recently interned at Apple after attending WWDC as a scholarship
          winner for three consecutive years.

    .team-section
      .team-picture
        img(src="~assets/images/team-scholars.jpg")
        .title WWDCScholarships

      base-section
        .subsection
          h4.color-red2 What is a WWDC Scholarship?
          p.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
            est laborum.
        
        .subsection
          h4.color-red2 How can I apply?
          p.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
            est laborum.
          
        .subsection
          h4.color-red2 How do I join WWDCScholars?
          p.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
            est laborum.
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import {
  BaseSection,
  TeamCard
} from '~/components'

@Component({
  components: {
    BaseSection,
    TeamCard
  }
})
export default class PageAbout extends Vue {}
</script>

<style lang="sass" scoped>
.container-fluid
  padding-top: 80px

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

.team-picture
  position: relative

  img
    width: 100%
    border-radius: $border-radius-large
    +shadow

  .title
    position: absolute
    bottom: 8%
    left: 4%
    font-size: 2.3em
    font-weight: 700
    color: $white

    span
      font-weight: 500

.team-section
  margin-bottom: 40px

  &:last-of-type
    margin-bottom: 0

  .team-picture
    margin-bottom: 40px

.team-cards
  display: grid
  grid-template-columns: 1fr 1fr
  grid-gap: 40px
</style>
