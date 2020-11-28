<template lang="pug">
.mk-map(ref="mapKitMap")
  slot
</template>

<script lang="ts">
import { resolve } from 'dns'
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { featureEnum } from '~/util/mapkit'

let resolveReady: (map?: mapkit.Map) => void

@Component
export default class MKMap extends Vue {
  @Prop({ default: 'standard' })
  mapType!: string

  @Prop({ default: undefined })
  padding!: { top?: number, right?: number, bottom?: number, left?: number }

  @Prop({ default: 'adaptive' })
  showsCompass!: string

  @Prop({ default: true })
  showsMapTypeControl!: boolean

  @Prop({ default: true })
  showsZoomControl!: boolean

  @Prop({ default: false })
  showsUserLocationControl!: boolean

  @Prop({ default: false })
  showsPointsOfInterest!: boolean

  @Prop({ default: 'adaptive' })
  showsScale!: string

  @Prop({ default: '' })
  tintColor!: string

  @Prop({ default: undefined })
  center?: mapkit.Coordinate

  @Prop({ default: undefined })
  region?: mapkit.CoordinateRegion

  @Prop({ default: undefined })
  rotation?: number

  @Prop({ default: undefined })
  visibleMapRect?: mapkit.MapRect

  @Prop({ default: undefined })
  cameraBoundary?: mapkit.CameraBoundaryDescription

  @Prop({ default: undefined })
  cameraDistance?: number

  @Prop({ default: undefined })
  cameraZoomRange?: mapkit.CameraZoomRange

  $map?: mapkit.Map

  deferredReadyPromise = new Promise<mapkit.Map>(resolve => {
    resolveReady = resolve
  })

  items: any[] = []

  mounted() {
    this.init()
  }

  beforeDestroy() {
    this.$map?.destroy()
  }

  async init() {
    await this.$loadMapKit()
    this.$map = new mapkit.Map(this.$refs.mapKitMap as any)
    resolveReady(this.$map)
    this.setMapType(this.mapType)
    this.setPadding(this.padding)
    this.setShowsCompass(this.showsCompass)
    this.setShowsMapTypeControl(this.showsMapTypeControl)
    this.setShowsZoomControl(this.showsZoomControl)
    this.setShowsUserLocationControl(this.showsUserLocationControl)
    this.setShowsPointsOfInterest(this.showsPointsOfInterest)
    this.setShowsScale(this.showsScale)
    this.setTintColor(this.tintColor)
    this.setCenter(this.center)
    this.setRegion(this.region)
    this.setRotation(this.rotation)
    this.setVisibleMapRect(this.visibleMapRect)
    this.setCameraBoundary(this.cameraBoundary)
    this.setCameraDistance(this.cameraDistance)
    this.setCameraZoomRange(this.cameraZoomRange)
  }

  @Watch('mapType')
  setMapType(mapType: string) {
    mapType = mapType.toLowerCase()
    if (mapType != 'standard' && mapType != 'satellite' && mapType != 'hybrid') {
      mapType = 'standard'
    }

    if (this.$map) this.$map.mapType = mapType
  }

  @Watch('padding')
  setPadding(padding: { top?: number, right?: number, bottom?: number, left?: number }) {
    const { top, right, bottom, left } = {
      ...{ top: 0, right: 0, bottom: 0, left: 0 },
      ...padding
    }

    if (this.$map) this.$map.padding = new mapkit.Padding(top, right, bottom, left)
  }

  @Watch('showsCompass')
  setShowsCompass(showsCompass: string) {
    if (this.$map) this.$map.showsCompass = featureEnum(showsCompass)
  }

  @Watch('showsMapTypeControl')
  setShowsMapTypeControl(showsMapTypeControl: boolean) {
    if (this.$map) this.$map.showsMapTypeControl = showsMapTypeControl
  }

  @Watch('showsZoomControl')
  setShowsZoomControl(showsZoomControl: boolean) {
    if (this.$map) this.$map.showsZoomControl = showsZoomControl
  }

  @Watch('showsUserLocationControl')
  setShowsUserLocationControl(showsUserLocationControl: boolean) {
    if (this.$map) this.$map.showsUserLocationControl = showsUserLocationControl
  }

  @Watch('showsPointsOfInterest')
  setShowsPointsOfInterest(showsPointsOfInterest: boolean) {
    if (this.$map) this.$map.showsPointsOfInterest = showsPointsOfInterest
  }

  @Watch('showsScale')
  setShowsScale(showsScale: string) {
    if (this.$map) this.$map.showsScale = featureEnum(showsScale)
  }

  @Watch('tintColor')
  setTintColor(tintColor: string) {
    if (this.$map) this.$map.tintColor = tintColor
  }

  @Watch('center')
  setCenter(center?: mapkit.Coordinate, animated: boolean = true) {
    if (center && this.$map) this.$map.setCenterAnimated(center, animated)
  }

  @Watch('region')
  setRegion(region?: mapkit.CoordinateRegion, animated: boolean = true) {
    if (region && this.$map) this.$map.setRegionAnimated(region, animated)
  }

  @Watch('rotation')
  setRotation(rotation?: number, animated: boolean = true) {
    if (rotation && this.$map) this.$map.setRotationAnimated(rotation, animated)
  }

  @Watch('visibleMapRect')
  setVisibleMapRect(visibleMapRect?: mapkit.MapRect, animated: boolean = true) {
    if (visibleMapRect && this.$map) this.$map.setVisibleMapRectAnimated(visibleMapRect, animated)
  }

  @Watch('cameraBoundary')
  setCameraBoundary(cameraBoundary?: mapkit.CameraBoundaryDescription, animated: boolean = true) {
    if (cameraBoundary && this.$map) {
      if (cameraBoundary.mapRect)
        this.$map.setCameraBoundaryAnimated(cameraBoundary.mapRect, animated)
      else if (cameraBoundary.region)
        this.$map.setCameraBoundaryAnimated(cameraBoundary.region, animated)
    }
  }

  @Watch('cameraDistance')
  setCameraDistance(cameraDistance?: number, animated: boolean = true) {
    if (cameraDistance && this.$map) this.$map.setCameraDistanceAnimated(cameraDistance, animated)
  }

  @Watch('cameraZoomRange')
  setCameraZoomRange(cameraZoomRange?: mapkit.CameraZoomRange, animated: boolean = true) {
    if (cameraZoomRange && this.$map) this.$map.setCameraZoomRangeAnimated(cameraZoomRange, animated)
  }
}
</script>
