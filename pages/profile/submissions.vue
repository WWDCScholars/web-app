<template lang="pug">
.container-fluid
  profile-submission(
    v-if="wwdcYears.length > 0",
    v-for="year in wwdcYears",
    :key="year.recordName",
    :yearRecordName="year.recordName",
    :yearInfo="yearInfos[year.recordName]"
  )
  .profile-submissions-empty(v-else)
    i You don't have any submissions yet
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Scholar, WWDCYear, WWDCYearInfo, CloudKit } from '@wwdcscholars/cloudkit'
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

  get wwdcYears(): CloudKit.Reference[] {
    if (!this.scholar || !this.scholar.wwdcYears) return []
    return this.scholar.wwdcYears
  }

  get yearInfos(): { [yearRecordName: string]: WWDCYearInfo } | null {
    if (!this.scholar) return null
    return this.scholar.loadedYearInfos
  }

  async fetch({ store, route, from }) {
    await store.dispatch('profile/loadScholar')

    // load lazy, no need to await
    store.dispatch('profile/loadYearInfos')
  }
}
</script>

<style lang="sass" scoped>
.profile-submissions-empty
  padding: 40px 10px
  text-align: center
</style>
