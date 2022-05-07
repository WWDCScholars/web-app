<template lang="pug">
div
  div(ref="callout")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { findRootNode, featureEnum } from '~/util/mapkit'
import MKMap from './MKMap.vue'

@Component
export default class MKMarkerAnnotation extends Vue {
  @Prop({ default: () => ({}), type: Object })
  options!: mapkit.MarkerAnnotationConstructorOptions

  @Prop({ required: true, type: Object })
  coordinate!: mapkit.Coordinate

  @Prop({ default: undefined, type: String })
  title?: string

  @Prop({ default: undefined, type: String })
  subtitle?: string

  @Prop({ default: undefined, type: Object })
  titleVisibility?: string

  @Prop({ default: undefined, type: Object })
  subtitleVisibility?: string

  @Prop({ default: undefined, type: String })
  color?: string

  @Prop({ default: undefined, type: String })
  glyphColor?: string

  @Prop({ default: undefined, type: String })
  glyphText?: string

  @Prop({ default: undefined, type: Object })
  glyphImage?: object

  @Prop({ default: undefined, type: Object })
  selectedGlyphImage?: object

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

    // Set properties from props
    this.setTitle(this.title)
    this.setSubtitle(this.subtitle)
    this.setTitleVisibility(this.titleVisibility)
    this.setSubtitleVisibility(this.subtitleVisibility)
    this.setColor(this.color)
    this.setGlyphColor(this.glyphColor)
    this.setGlyphText(this.glyphText)
    this.setGlyphImage(this.glyphImage)

    this.$map?.addAnnotation(this.$annotation)
  }

  @Watch('coordinate')
  onCoordinateChanged(): void {
    if (!this.$annotation) return

    this.$annotation.coordinate = this.coordinate
  }

  @Watch('title')
  setTitle(title?: string) {
    if (title && this.$annotation) this.$annotation.title = title
  }

  @Watch('subtitle')
  setSubtitle(subtitle?: string) {
    if (subtitle && this.$annotation) this.$annotation.subtitle = subtitle
  }

  @Watch('titleVisibility')
  setTitleVisibility(titleVisibility?: string) {
    if (titleVisibility && this.$annotation) this.$annotation.titleVisibility = featureEnum(titleVisibility)
  }

  @Watch('subtitleVisibility')
  setSubtitleVisibility(subtitleVisibility?: string) {
    if (subtitleVisibility && this.$annotation) this.$annotation.subtitleVisibility = featureEnum(subtitleVisibility)
  }

  @Watch('color')
  setColor(color?: string) {
    if (color && this.$annotation) this.$annotation.color = color
  }

  @Watch('glyphColor')
  setGlyphColor(glyphColor?: string) {
    if (glyphColor && this.$annotation) this.$annotation.glyphColor = glyphColor
  }

  @Watch('glyphText')
  setGlyphText(glyphText?: string) {
    if (glyphText && this.$annotation) this.$annotation.glyphText = glyphText
  }

  @Watch('glyphImage')
  setGlyphImage(glyphImage?: object) {
    if (glyphImage && this.$annotation) this.$annotation.glyphImage = glyphImage
  }

  @Watch('selectedGlyphImage')
  setSelectedGlyphImage(selectedGlyphImage?: object  ) {
    if (selectedGlyphImage && this.$annotation) this.$annotation.selectedGlyphImage = selectedGlyphImage
  }
}
</script>
