<template lang="pug">
.container.container-outer.scholar-profile
  .scholar-map
  .scholar-info
    img(:src="profilePictureURL").scholar-image
    h1.scholar-name {{ fullName }}
    .scholar-location {{ scholar.location }}

    .scholar-meta
      .scholar-meta-field.scholar-age
        .scholar-label.color-red Age
        .scholar-value {{ age }}
      .scholar-meta-field.scholar-attended
        .scholar-label.color-blue Attended
        .scholar-value {{ attended }}

    .scholar-bio {{ scholar.shortBio }}

    .scholar-social-links
      //- a(href="", alt="Facebook"): img(src="~images/icon-facebook.png")
      //- a(href="", alt="GitHub"): img(src="")
      //- a(href="", alt="iMessage"): img(src="")
      //- a(href="", alt="LinkedIn"): img(src="")
      //- a(href="", alt="Twitter"): img(src="~images/icon-twitter.png")
      //- a(href="", alt="Website"): img(src="")

  h2 Submission
</template>

<script>
import moment from 'moment'
import { Scholar, WWDCYearInfo } from '../models'

export default {
  name: 'scholar-profile',
  store: ['auth'],
  data () {
    return {
      recordName: '',
      profilePictureURL: '',
      scholar: {}
    }
  },
  computed: {
    fullName () {
      if (!this.scholar.firstName && !this.scholar.lastName) { return '' }
      return this.scholar.firstName + ' ' + this.scholar.lastName
    },
    age () {
      if (!this.scholar.birthday) { return '' }
      return moment().diff(this.scholar.birthday, 'year')
    },
    attended () {
      if (!this.scholar.wwdcYears) { return '' }

      var ret = []
      for (var i = 0; i < this.scholar.wwdcYears.length; i++) {
        ret.push(this.scholar.wwdcYears[i].recordName)
      }
      return ret.join(', ')
    }
  },
  created () {
    this.$store.auth.on('CloudKit_Initialized', this.onCloudKitInitialized)
    this.recordName = this.$route.params.recordName
  },
  mounted () {},
  methods: {
    async onCloudKitInitialized () {
      if (!this.recordName) { return }

      this.scholar = await new Scholar().fetch(this.recordName)
      this.profilePictureURL = await this.latestProfilePictureURL(this.scholar)
    },
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
@import "~style.page/scholar-profile"
</style>
