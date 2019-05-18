<template lang="pug">
.container-outer
  .tab-bar-container
    navigation-tab-bar.form-color-purple
      nuxt-link(
        v-for="(link, year) in yearLinks",
        :to="link",
        :key="year"
      ) {{ year }}
  .container-fluid.color-purple
    .scholars-list(v-if="currentScholars.length > 0")
      scholar-thumbnail(
        v-for="scholar in currentScholars",
        :scholar.once="scholar",
        :key="scholar.recordName"
      )
    .no-scholars(v-else) #[i Unfortunately there are no Scholars to show yet]&nbsp;&nbsp;😭
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Scholar, WWDCYear } from '@wwdcscholars/cloudkit'
import { NavigationTabBar, ScholarThumbnail } from '~/components'

import { name as yearsName } from '~/store/years'
const Years = namespace(yearsName)
import { name as scholarsName } from '~/store/scholars'
const Scholars = namespace(scholarsName)

@Component({
  components: {
    NavigationTabBar,
    ScholarThumbnail
  }
})
export default class PageIndex extends Vue {
  @Years.State('years')
  allYears!: { [recordName: string]: WWDCYear }

  @Scholars.State('scholars')
  allScholars!: { [recordName: string]: Scholar }

  get latestYear(): WWDCYear {
    const keys = Object.keys(this.allYears)
    return this.allYears[keys[keys.length - 1]]
  }

  get currentYear(): WWDCYear {
    if (this.$route.params.year) {
      return this.allYears[`WWDC ${this.$route.params.year}`]
    }

    return this.latestYear
  }

  get yearLinks(): { [year: string]: object } {
    return Object.entries(this.allYears).reduce((acc, [, record]) => {
      const params = record === this.latestYear ? {} : { year: record.year }
      acc[record.year] = {
        name: 'scholars-year',
        params
      }
      return acc
    }, {})
  }

  get currentScholars(): Scholar[] {
    if (!this.currentYear) return []
    const currentYearRecordName = this.currentYear.recordName
    return Object.values(this.allScholars).filter(scholar => {
      return scholar.wwdcYears.some(ref => ref.recordName === currentYearRecordName)
    })
  }

  validate({ params }): boolean {
    if (!params.year) return true
    const year = params.year
    return /^\d{4}$/.test(year)
  }

  async fetch ({ store, params }) {
    await store.dispatch('years/queryYears')
    const years = store.state.years.years

    let year: WWDCYear
    if (params.year) {
      year = years[`WWDC ${params.year}`]
    } else {
      const keys = Object.keys(years)
      year = years[keys[keys.length - 1]]
    }

    await store.dispatch('scholars/queryScholars', year)
  }
}
</script>

<style lang="sass" scoped>
.scholars-list
  margin-top: 30px
  display: grid
  grid-template-columns: repeat(auto-fill, 160px)
  grid-auto-rows: 160px
  grid-gap: 15px
  justify-content: center

  .scholar-thumbnail
    display: block

.no-scholars
  margin-top: 30px
  text-align: center
  color: $sch-gray0
</style>
