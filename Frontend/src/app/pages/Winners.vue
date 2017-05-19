<template lang="pug">
.container.container-outer.color-gray

  tab-bar(name="year", :tabs="['2011', '2012', '2013', '2014', '2015', '2016', '2017']", initial="2017", @change="onTabChange")

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
