<template lang="pug">
.input-location
  input-text(
    type="text",
    :name.once="name",
    :placeholder.once="placeholder",
    :required.once="required",
    :value="inputValue"
  )
    gmap-autocomplete(
      :types.once="['(cities)']",
      placeholder="",
      :value="inputValue",
      @place_changed="setPlace"
    )

  gmap-map(
    :center="center",
    :options.once="mapOptions",
    :zoom.once="1",
    ref="map"
  ).map
    gmap-marker(
      v-if="center.lat !== 0 || center.lng !== 0",
      :position="center",
      :clickable="true",
      :draggable="false"
    )
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'
import { CloudKit } from '@wwdcscholars/cloudkit'
import InputText from './InputText.vue'

@Component({
  components: { InputText }
})
export default class InputLocation extends Vue {
  @Model('change', { default: () => ({ latitude: 0, longitude: 0 }) })
  value!: CloudKit.Location

  @Prop({ required: true })
  name!: string
  @Prop({ required: true })
  placeholder!: string
  @Prop({ default: false })
  required!: boolean

  value_validate: { latitude: number; longitude: number } = this.value || { latitude: 0, longitude: 0 }  // tslint:disable-line

  inputValue: string = ''
  zoom: number = 1
  mapOptions: object = {
    disableDefaultUI: true,
    gestureHandling: 'none',
    scrollWheel: false
  }

  get center(): google.maps.LatLngLiteral {
    return {
      lat: this.value.latitude,
      lng: this.value.longitude
    }
  }

  async created() {
    await this['$gmapApiPromiseLazy']()
    if (this.value && this.value.latitude !== 0 && this.value.longitude !== 0) {
      this.setInputValueFromCoords(this.value)
    }
  }

  setPlace(place) {
    if (!place) { return }
    const value = {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng()
    }
    this.value_validate = value
    this.$emit('change', value)
    this.inputValue = place.formatted_address
    this.$refs.map['fitBounds'](place.geometry.viewport)
  }

  setInputValueFromCoords({ latitude, longitude }) {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({
      location: { lat: latitude, lng: longitude }
    }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        return
      }

      let resultIndex = results.length - 1
      let result
      do {
        result = results[resultIndex--]
      } while (result.address_components[0].types[0] !== 'locality')
      this.inputValue = result.formatted_address
      this.$refs.map['fitBounds'](result.geometry.viewport)
    })
  }
}
</script>

<style lang="sass" scoped>
.input-location
  .map
    width: 100%
    padding-top: 51%
    margin-top: 15px
    border-radius: $border-radius
    overflow: hidden
</style>
