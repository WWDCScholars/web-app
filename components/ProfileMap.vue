<template lang="pug">
MKMap(
  ref="map",
  :options="mapOptions",
  :region="region"
  :colorScheme="this.$colorMode.value"
).profile-map
  MKMarkerAnnotation(
    v-if="coordinate",
    :options="annotationOptions",
    :color="color",
    :glyphColor="glyphColor",
    :coordinate="coordinate",
    :title="annotationTitle"
  )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { MKMap, MKMarkerAnnotation } from './mapkit'
import { getCSSColor } from '~/util/css-variable'

@Component({
  components: { MKMap, MKMarkerAnnotation }
})
export default class ProfileMap extends Vue {
  @Prop({ default: undefined })
  coordinate?: mapkit.Coordinate

  @Prop({ default: undefined })
  annotationTitle?: string

  mapOptions: mapkit.MapConstructorOptions = {
    mapType: 'mutedStandard',
    showsCompass: 'hidden',
    showsScale: 'hidden',
    showsMapTypeControl: false,
    showsUserLocationControl: false,
    showsPointsOfInterest: false,
    colorScheme: this.$colorMode.value
  }
  annotationOptions: mapkit.MarkerAnnotationConstructorOptions = {
    enabled: false,
    glyphImage: { 1: '/icons/logo_plain_minimal.svg' }
  }

  get region(): mapkit.CoordinateRegion | undefined {
    if (!this.coordinate) return undefined

    return new mapkit.CoordinateRegion(
      this.coordinate,
      new mapkit.CoordinateSpan(11, 11)
    )
  }

  get color(): string {
    if (this.$colorMode.value === 'unknown') return ''
    return getCSSColor('sch-purple')
  }

  get glyphColor(): string {
    if (this.$colorMode.value === 'unknown') return ''
    return getCSSColor('label-inverted')
  }
}
</script>

<style lang="sass" scoped>
.profile-map
  width: 100%
  height: 100%

  ::v-deep .mk-controls-container
    inset: 0px 0px 30px

@media (min-width: #{$container-max-width + 60px})
  .profile-map
    ::v-deep .mk-controls-container
      inset: 0px 0px 0px
</style>
