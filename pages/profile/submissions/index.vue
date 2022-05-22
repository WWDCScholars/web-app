<template lang="pug">
.container-fluid
  .add-submission
    base-button(to="/profile/submissions/new").btn-round.btn-add-submission
      PlusIcon
      | Add submission

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
  BaseButton,
  ProfileSubmission
} from '~/components'

import PlusIcon from '~/assets/images/plus.svg?inline'

import { name as profileName } from '~/store/profile'
const Profile = namespace(profileName)

@Component({
  components: {
    BaseButton,
    ProfileSubmission,
    PlusIcon
  }
})
export default class PageProfileSubmissionsIndex extends Vue {
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

.add-submission
  display: flex
  justify-content: flex-end
  margin-top: 20px
  margin-bottom: -15px
  padding-right: 5px

  .btn-round.btn-add-submission
    ::v-deep a
      background-color: transparent
      color: $sch-purple
      border: none

    svg
      width: 14px
      height: 14px
      margin-right: 8px
</style>
