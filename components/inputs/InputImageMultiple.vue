<template lang="pug">
.input-image-multiple
  input-image(
    v-for="(image, index) in tempValue",
    :key="name + '_' + index",
    :name="name + '_' + index",
    :accept="accept",
    :required="required",
    :value="image",
    @input="removeOrReplace($event, index)"
  )

  input-image(
    v-if="maxCount && imageCount < maxCount",
    :name="name + '-' + imageCount",
    :accept="accept",
    :required="required",
    :value="undefined",
    @input="addNew"
  )
    template(v-slot:icon): img(src="~assets/images/add-icon.png").upload-icon
</template>

<script lang="ts">
import { Component, Model, Prop, Watch, Vue } from 'nuxt-property-decorator'
import InputImage from './InputImage.vue'

@Component({
  components: { InputImage }
})
export default class InputImageMultiple extends Vue {
  @Model('input')
  value!: (File | string | null)[]

  @Prop({ required: true })
  name!: string
  @Prop({ default: 'image/*' })
  accept!: string
  @Prop({ default: false })
  required!: boolean
  @Prop({ type: Number, default: undefined })
  maxCount?: number

  tempValue: (File | string | null)[] = []

  get imageCount(): number {
    return this.tempValue.length
  }

  created() {
    this.valueChanged()
  }

  addNew(value) {
    this.$set(this.tempValue, this.imageCount, value)
    this.$emit('input', this.tempValue)
  }

  removeOrReplace(value, index) {
    if (value === null) {
      this.$delete(this.tempValue, index)
    } else {
      this.$set(this.tempValue, index, value)
    }
    this.$emit('input', this.tempValue)
  }

  @Watch('value')
  valueChanged() {
    this.tempValue = this.value
  }
}
</script>

<style lang="sass" scoped>
.input-image-multiple
  display: grid
  grid-template-columns: repeat(auto-fill, 175px)
  grid-auto-rows: 120px
  grid-gap: 10px
</style>
