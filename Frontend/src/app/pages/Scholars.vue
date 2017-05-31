<template lang="pug">
.page-scholars.section-accent-color-purple
  modal(v-if="showProfile", :closeButton="true", @close="onProfileClose").modal-profile
    scholar-profile(slot="body", :year="currentYear", :scholar="currentScholar")

  .modal-background(:class="{ 'modal-background-blur': showProfile }")
    tab-bar(name="year", :tabs="['2013', '2014', '2015', '2016', '2017']", initial="2017", @change="onTabChange")
    .container.container-outer.color-black
      .scholars-list(v-if="scholars")
        scholar-thumbnail(v-for="scholar in scholars", :scholar="scholar", :key="scholar.recordName")
</template>

<script>
import { Scholar } from '../models'
import { TabBar, Modal } from 'components'
import ScholarThumbnail from '../components/ScholarThumbnail.vue'
import ScholarProfile from '../components/ScholarProfile.vue'

export default {
  name: 'scholars',
  store: ['auth'],
  data () {
    return {
      scholars: {},
      scholarProfilePictures: [],
      currentYear: '2017',

      showProfile: false,
      currentScholar: undefined
    }
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
    onCloudKitInitialized () {
      this.updateShowProfile(this.$route)
      this.queryScholars()
    },
    async queryScholars () {
      let scholars = await new Scholar().query({
        filterBy: [{
          fieldName: 'wwdcYears',
          comparator: 'LIST_CONTAINS',
          fieldValue: { value: { recordName: 'WWDC ' + this.currentYear } }
        }, {
          fieldName: 'status',
          comparator: 'EQUALS',
          fieldValue: { value: 'accepted' }
        }],
        sortBy: [
          { fieldName: 'firstName' }
        ]
      })
      const ret = {}
      for (var i = 0; i < scholars.length; i++) {
        ret[scholars[i].recordName] = scholars[i]
      }
      this.scholars = ret
    },
    onTabChange (value) {
      this.currentYear = value
      this.queryScholars()
    },
    updateShowProfile (route) {
      this.showProfile = (route.params.recordName !== undefined)
      this.currentScholar = this.scholars[route.params.recordName]
    },
    onProfileClose () {
      this.$router.push({ name: 'scholars' })
    }
  },
  watch: {
    '$route': 'updateShowProfile'
  },
  components: {
    TabBar,
    Modal,
    ScholarThumbnail,
    ScholarProfile
  }
}
</script>

<style lang="css">
</style>
