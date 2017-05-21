<template lang="pug">
.container.container-outer.color-black.page-scholars
  .scholars-intro.section-accent-color-purple
    h2 Welcome to WWDC#[span Scholars]
    p.
      Each year Apple hosts their World Wide Developers Conference (WWDC) in California where they showcase their latest software and services. As part of this, students and members of STEM organisations with an interest in programming have the unique opportunity to win a Scholarship to attend.

    p.
      WWDCScholars was created to showcase the winning applications and to introduce you to the talented developers behind them. If you're a current or previous Scholarship winner - head to #[a(href="") My Profile] to submit or edit your details.

  tab-bar(name="year", :tabs="['2013', '2014', '2015', '2016', '2017']", initial="2017", @change="onTabChange")

  .scholars-list
    scholar-thumbnail(v-for="scholar in scholars", :scholar="scholar", :key="scholar.recordName")
</template>

<script>
import { Scholar } from '../models'
import { TabBar } from 'components'
import ScholarThumbnail from '../components/ScholarThumbnail.vue'

export default {
  name: 'signin',
  store: ['auth'],
  data () {
    return {
      scholars: [],
      scholarProfilePictures: [],
      currentYear: '2017'
    }
  },
  computed: {},
  created () {
    this.$store.auth.on('CloudKit_Initialized', this.onCloudKitInitialized)
  },
  mounted () {},
  methods: {
    onCloudKitInitialized () {
      this.queryScholars()
    },
    async queryScholars () {
      this.scholars = await new Scholar().query({
        filterBy: [{
          fieldName: 'wwdcYears',
          comparator: 'LIST_CONTAINS',
          fieldValue: { value: { recordName: 'WWDC ' + this.currentYear } }
        }]
      })
    },
    onTabChange (value) {
      this.currentYear = value
      this.queryScholars()
    }
  },
  components: {
    TabBar,
    ScholarThumbnail
  }
}
</script>

<style lang="css">
</style>
