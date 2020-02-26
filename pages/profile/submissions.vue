<template lang="pug">
.container-fluid
  profile-submission(
    v-for="year in wwdcYears",
    :key="year.recordName",
    :yearRecordName="year.recordName",
    :yearInfo="yearInfos[year.recordName]"
  )
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Scholar, WWDCYear, WWDCYearInfo, CloudKit } from '@wwdcscholars/cloudkit'
import {
  ProfileSubmission
} from '~/components'

import { name as authName } from '~/store/auth'
const Auth = namespace(authName)

import { name as scholarsName } from '~/store/scholars'
const Scholars = namespace(scholarsName)

@Component({
  components: {
    ProfileSubmission
  }
})
export default class PageProfileSubmission extends Vue {
  @Auth.State
  userScholarReference?: CloudKit.Reference

  @Scholars.Getter('byRecordName') scholarByRecordName

  get scholar(): Scholar | null {
    if (!this.userScholarReference) return null
    return this.scholarByRecordName(this.userScholarReference.recordName)
  }

  get wwdcYears(): CloudKit.Reference[] {
    if (!this.scholar) return []
    return this.scholar.wwdcYears
  }

  get yearInfos(): { [yearRecordName: string]: WWDCYearInfo } | null {
    if (!this.scholar) return null
    return this.scholar.loadedYearInfos
  }

  async fetch({ store, route, from }) {
    // if (route.fullPath === from.fullPath) return

    // else, load data for new route
    const userScholarReference = store.state.auth.userScholarReference
    if (!userScholarReference) return

    await store.dispatch('scholars/fetchScholar', userScholarReference.recordName)
    const scholar: Scholar = store.getters['scholars/byRecordName'](userScholarReference.recordName)
    if (!scholar) return

    scholar.wwdcYearInfos.forEach((yearInfoReference) => {
      // don't await to make page load faster
      store.dispatch('scholars/loadYearInfoIfMissing', {
        scholarRecordName: scholar.recordName,
        yearInfoRecordName: yearInfoReference.recordName
      })
    })
  }
}
</script>

<style lang="sass" scoped></style>
