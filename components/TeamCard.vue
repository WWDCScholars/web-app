<template lang="pug">
component(:is="rootComponent", :to="profileLink").team-card-link
  base-section.team-card
    .image
      img(v-lazy="image")
    .info
      .name {{ name }}
      .age {{ age }}
      .body
        slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { CloudKit } from '@wwdcscholars/cloudkit'
import BaseSection from './BaseSection.vue'

@Component({
  components: { BaseSection }
})
export default class TeamCard extends Vue {
  @Prop({ required: true })
  name!: string
  @Prop({ required: true })
  age!: string
  @Prop({ required: true })
  image!: string
  @Prop({ default: undefined })
  scholar?: CloudKit.Reference

  get profileLink(): object | undefined {
    if (!this.scholar) return undefined

    return {
      name: 's-id-year',
      params: {
        id: this.scholar.recordName
      }
    }
  }

  get rootComponent(): string {
    return this.scholar ? 'nuxt-link' : 'div'
  }
}
</script>

<style lang="sass" scoped>
.team-card-link
  display: block
  text-decoration: none

.team-card
  display: flex
  justify-content: flex-start
  align-items: center
  color: $apl-black

.image
  margin-right: 20px

  img
    width: 80px
    height: 80px
    border: 4px solid $white
    border-radius: 50%
    +shadow

.name, .age
  display: inline
  font-size: 1.4em
  font-weight: 700

.name
  color: $sch-purple
  margin-right: 8px

.age
  color: transparentize($sch-purple, 0.5)

.body
  margin-top: 8px
  font-size: 0.9em
</style>
