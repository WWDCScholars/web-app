<template lang="pug">
.page-scholars.section-accent-color-purple
  modal(v-if="showProfile").modal-profile
    scholar-profile(slot="body")

  .modal-blur(v-if="showProfile")
    tab-bar(name="year", :tabs="['2013', '2014', '2015', '2016', '2017']", initial="2017", @change="onTabChange")
    .container.container-outer.color-black
      .scholars-list
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
      scholars: [],
      scholarProfilePictures: [],
      currentYear: '2017',

      showProfile: true
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
    Modal,
    ScholarThumbnail,
    ScholarProfile
  }
}
</script>

<style lang="css">
</style>
