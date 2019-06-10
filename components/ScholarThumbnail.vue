<template lang="pug">
nuxt-link(:to.once="{ name: 's-id-year', params: { id: scholar.recordName } }").scholar-thumbnail
  span.name {{ scholar.givenName }}
  img(v-lazy="profilePictureURL").image
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Scholar } from '@wwdcscholars/cloudkit'

@Component
export default class ScholarThumbnail extends Vue {
  @Prop({ required: true })
  scholar!: Scholar

  get profilePictureURL(): string {
    if (!this.scholar.profilePicture) {
      return ''
    }
    return this.scholar.profilePicture.downloadURL
  }
}
</script>

<style lang="sass" scoped>
.scholar-thumbnail
  position: relative
  max-width: 160px
  max-height: 160px
  width: 100%
  height: 100%
  border-radius: $border-radius-large
  overflow: hidden
  border: 0
  background: 0
  padding: 0

  .image
    width: 100%
    height: 100%
    object-fit: cover

    &[lazy="loading"], &[lazy="error"]
      padding: 35% 40% 45%

  .name
    position: absolute
    bottom: 0px
    left: 0px
    width: 100%
    background-color: transparentize($sch-purple, 0.25)
    color: $white
    font-size: 1.1em
    font-weight: 500
    text-align: center
    padding: 7px 8px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
</style>
