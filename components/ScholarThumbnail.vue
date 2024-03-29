<template lang="pug">
nuxt-link(
  :to.once="profileLocation",
  :id="scholar.recordName"
).scholar-thumbnail
  span.name {{ scholar.givenName }}
  img(v-lazy="profilePictureURL").image
  .image-loading
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Location } from 'vue-router'
import { Scholar } from '@wwdcscholars/cloudkit'

@Component
export default class ScholarThumbnail extends Vue {
  @Prop({ required: true, type: Object })
  scholar!: Scholar

  @Prop({ required: true, type: String })
  year!: string

  get profileLocation(): Location {
    return {
      name: 's-id-year',
      params: {
        id: this.scholar.recordName!,
        year: this.year
      }
    }
  }

  get profilePictureURL(): string {
    if (!this.scholar || !this.scholar.profilePicture) {
      return ''
    }

    return this.scholar.profilePicture.downloadURL
      .replace('${f}', `${this.scholar.recordName}_profilePicture.jpg`)
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
      padding: 10% 20% 30%

    $gradient-start: transparent
    $gradient-mid: $grey5
    &[lazy="loading"] + .image-loading
      display: block
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 499
      background: transparent
      background-image: linear-gradient(to right, $gradient-start 0%, $gradient-mid 20%, $gradient-start 40%, $gradient-start 100%)
      background-repeat: no-repeat
      background-size: 200% 100%
      animation-duration: 1.5s
      animation-fill-mode: forwards
      animation-iteration-count: infinite
      animation-name: shimmer
      animation-timing-function: linear

  .name
    position: absolute
    bottom: 0px
    left: 0px
    width: 100%
    border-bottom-left-radius: $border-radius-large
    border-bottom-right-radius: $border-radius-large
    z-index: 500
    background-color: $sch-purple-secondary
    color: $label-inverted
    font-size: 1.1em
    font-weight: 500
    text-align: center
    padding: 7px 8px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis

@keyframes shimmer
  0%
    background-position: -468px 0
  100%
    background-position: 468px 0
</style>
