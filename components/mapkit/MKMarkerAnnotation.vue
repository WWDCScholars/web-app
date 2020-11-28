<template lang="pug">
div
  div(ref="callout")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { findRootNode } from '~/util/mapkit'
import MKMap from './MKMap.vue'

@Component
export default class MKMarkerAnnotation extends Vue {
  @Prop({ required: true, type: Object })
  coordinate!: mapkit.Coordinate

  @Prop({ default: () => {}, type: Object })
  options!: mapkit.MarkerAnnotationConstructorOptions

  $parentMap?: MKMap = undefined
  $map?: mapkit.Map
  $annotation?: mapkit.MarkerAnnotation

  async mounted() {
    this.$parentMap = findRootNode(this) as MKMap

    await this.$parentMap.deferredReadyPromise
    this.$map = this.$parentMap.$map
    this.init()
  }

  beforeDestroy() {
    if (this.$map && this.$map.element && this.$annotation) {
      this.$map.removeAnnotations([this.$annotation])
    }
  }

  init() {
    if (this.$map && this.$map.element && this.$annotation) {
      this.$map.removeAnnotations([this.$annotation])
    }

    this.$annotation = new mapkit.MarkerAnnotation(
      new mapkit.Coordinate(this.coordinate.latitude, this.coordinate.longitude),
      this.options
    )
    this.$map?.addAnnotation(this.$annotation)
  }

  @Watch('coordinate')
  onCoordinateChanged(): void {
    if (!this.$annotation) return

    this.$annotation.coordinate = this.coordinate
  }
}
</script>
