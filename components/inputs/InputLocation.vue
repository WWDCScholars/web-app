<template lang="pug">
.input-location
  MKSearch(
    v-model="textValue",
    @change="selectedResultChanged"
  )
    input-text(
      type="text",
      :name.once="name",
      :placeholder.once="placeholder",
      :required.once="required",
      :value="textValue",
      autocomplete="address-level2"
    )

  .input-map
    MKMap(
      ref="map",
      :options="mapOptions",
      :region="region"
      :colorScheme="this.$colorMode.value"
    ).map
      MKMarkerAnnotation(
        v-if="center",
        :options="annotationOptions",
        :color="color",
        :glyphColor="glyphColor",
        :coordinate="center",
      )
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'
import { CloudKit } from '@wwdcscholars/cloudkit'
import InputText from './InputText.vue'
import { MKSearch, MKMap, MKMarkerAnnotation } from '../mapkit'
import { getCSSColor } from '~/util/css-variable'

@Component({
  components: {
    InputText,
    MKSearch,
    MKMap,
    MKMarkerAnnotation
  }
})
export default class InputLocation extends Vue {
  @Model('change', { default: undefined })
  value!: CloudKit.Location | undefined

  @Prop({ required: true })
  name!: string
  @Prop({ required: true })
  placeholder!: string
  @Prop({ default: false })
  required!: boolean

  textValue: string = ''
  searchResults: mapkit.SearchAutocompleteResult[] = []
  center: mapkit.Coordinate | null = null
  mapOptions: mapkit.MapConstructorOptions = {
    mapType: 'mutedStandard',
    showsCompass: 'hidden',
    showsScale: 'hidden',
    showsMapTypeControl: false,
    showsZoomControl: true,
    showsUserLocationControl: false,
    showsPointsOfInterest: false,
    colorScheme: this.$colorMode.value
  }

  annotationOptions: mapkit.MarkerAnnotationConstructorOptions = {
    enabled: false,
    glyphImage: { 1: '/icons/logo_plain_minimal.svg' }
  }

  get region(): mapkit.CoordinateRegion | undefined {
    if (!this.center) return undefined

    return new mapkit.CoordinateRegion(
      this.center,
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

  value_validate: { latitude: number; longitude: number } = this.value || { latitude: 0, longitude: 0 }

  async created() {
    await this.$loadMapKit()

    if (!this.value) return
    this.center = new mapkit.Coordinate(this.value.latitude, this.value.longitude)
    this.geocodeInputValue(this.center)
  }

  selectedResultChanged(result: mapkit.SearchAutocompleteResult) {
    const value = {
      latitude: result.coordinate.latitude,
      longitude: result.coordinate.longitude
    }
    this.center = result.coordinate
    this.value_validate = value
    this.$emit('change', value)
    this.textValue = result.displayLines.join(', ')
  }

  geocodeInputValue(coordinate: mapkit.Coordinate) {
    const geocoder = new mapkit.Geocoder()
    geocoder.reverseLookup(coordinate, (error, response) => {
      if (error) {
        console.error(error)
        return
      }

      if (!response.results[0]) return
      const result = response.results[0]

      let slugComponents: string[] = []
      if (result.locality) slugComponents.push(result.locality)
      if (result.administrativeAreaCode) slugComponents.push(result.administrativeAreaCode)
      if (result.country) slugComponents.push(result.country)
      else slugComponents.push(result.countryCode)

      this.textValue = slugComponents.join(', ')
    })
  }
}
</script>

<style lang="sass" scoped>
.input-location
  position: relative

  ::v-deep .mk-autocomplete-results
    z-index: 1000
    top: calc(100% - 1px)
    background-color: $background-grouped-secondary-elevated
    border: 1px solid $grey2
    border-radius: $border-radius
    box-shadow: 0 2px 6px $shadow

    .mk-result
      padding: 5px 15px

  .input-map
    z-index: 999
    position: relative
    width: 100%
    padding-top: 51%
    margin-top: 15px
    border: 1px solid $grey3
    border-radius: $border-radius
    overflow: hidden
    background-color: $background-grouped-secondary-elevated

    .map
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0

+form-colors using ($fg, $bg)
  .input-location
    ::v-deep .mk-autocomplete-results
      box-shadow: 0 2px 6px tertiaryColor($bg)

      .mk-result
        &:hover, &.mk-result-selected
          color: $fg
          background-color: $bg
</style>
