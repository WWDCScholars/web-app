<template lang="pug">
router-link(:to="profileRoute").scholar-thumbnail
  .scholar-name {{ scholar.firstName }}
  img(:src="profilePictureURL").scholar-image
</template>

<script>
import { Scholar, WWDCYearInfo } from '../models'

export default {
  name: 'scholar-thumbnail',
  props: {
    scholar: Scholar,
    required: true
  },
  data () {
    return {
      profilePictureURL: ''
    }
  },
  computed: {
    profileRoute () {
      return {
        name: 'profile',
        params: { recordName: this.scholar.recordName }
      }
    }
  },
  async created () {
    let url = await this.latestProfilePictureURL(this.scholar)
    this.profilePictureURL = url
  },
  mounted () {},
  methods: {
    async latestProfilePictureURL (scholar) {
      let infoRecord = scholar.wwdcYearInfos[scholar.wwdcYearInfos.length - 1]
      let info = await new WWDCYearInfo().fetch(infoRecord.recordName)
      return info.profilePicture.downloadURL
    }
  },
  components: {}
}
</script>

<style lang="sass">
@import "~style.module/scholar-thumbnail"
</style>
