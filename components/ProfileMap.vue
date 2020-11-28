<template lang="pug">
MKMap(
  v-if="coordinate",
  ref="map",
  mapType="mutedStandard",
  showsCompass="hidden",
  showsScale="hidden",
  :padding="{ bottom: 30 }",
  :showsMapTypeControl="false",
  :showsUserLocationControl="false",
  :showsPointsOfInterest="false",
  :center="coordinate",
  :cameraDistance="cameraDistance"
).profile-map
  MKMarkerAnnotation(
    :coordinate="coordinate",
    :options="annotationOptions"
  )
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { MKMap, MKMarkerAnnotation } from './mapkit'

@Component({
  components: { MKMap, MKMarkerAnnotation }
})
export default class ProfileMap extends Vue {
  @Prop({ default: undefined })
  coordinate?: mapkit.Coordinate

  cameraDistance: number = 2000000
  annotationOptions: mapkit.MarkerAnnotationConstructorOptions = {
    enabled: false,
    color: this.$config.colors.purple,
    glyphColor: 'white',
    glyphImage: { 1: '/icons/logo_plain_minimal.svg' }
  }

  async create() {
    await this.$loadMapKit()
  }

  mounted() {
    this.onCoordinateChanged()
  }

  @Watch('coordinate')
  onCoordinateChanged() {
    const map = this.$refs.map as MKMap
    if (!map || !this.coordinate) return

    const region = new mapkit.CoordinateRegion(
      this.coordinate,
      new mapkit.CoordinateSpan(11, 11)
    )
    map.setRegion(region)
  }
}
</script>

<style lang="sass" scoped>
.profile-map
  width: 100%
  height: 100%
</style>
