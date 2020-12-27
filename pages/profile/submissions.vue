<template lang="pug">
.container-fluid
  profile-submission(
    v-if="submissions.length > 0",
    v-for="submission in submissions",
    :key="submission.year.recordName",
    :yearRecordName="submission.year.recordName",
    :yearInfoRecordName="submission.yearInfo.recordName"
  )
  .profile-submissions-empty(v-else)
    i You don't have any submissions yet
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Scholar, CloudKit } from '@wwdcscholars/cloudkit'
import {
  ProfileSubmission
} from '~/components'

import { name as profileName } from '~/store/profile'
const Profile = namespace(profileName)

@Component({
  components: { ProfileSubmission }
})
export default class PageProfileSubmission extends Vue {
  @Profile.Getter
  scholar?: Scholar

  get submissions(): { year: CloudKit.Reference, yearInfo: CloudKit.Reference }[] {
    if (!this.scholar || !this.scholar.wwdcYears || !this.scholar.wwdcYearInfos) return []

    return this.scholar.wwdcYears
      .map((year, index) => {
        return {
          year,
          yearInfo: this.scholar!.wwdcYearInfos[index]
        }
      })
  }
}
</script>

<style lang="sass" scoped>
.profile-submissions-empty
  padding: 40px 10px
  text-align: center
</style>
