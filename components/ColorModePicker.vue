<template lang="pug">
.color-container
  label(v-for="color of colors", :key="color")
    div(:class="getClasses(color)", @click="$colorMode.preference = color") {{ color }}
</template>

<script lang="ts">
import { Vue } from "nuxt-property-decorator";

export default class ColorModePicker extends Vue {
colors = ["system", "light", "dark"]

  getClasses(color) {
    // Does not set classes on ssr preference is system (because we know them on client-side)
    if (this.$colorMode.unknown) {
      return {};
    }
    return {
      preferred: color === this.$colorMode.preference,
      selected: color === this.$colorMode.value,
      "color-btn": true,
    };
  }
}
</script>

<style lang="sass" scoped>
.color-container
    display: inline-flex
    border-radius: 12px
    border: 2px solid $sch-purple
    font-size: 12px
    padding: 1px
    color: $sch-blue1

.color-btn
    box-sizing: border-box
    display: inline-block
    padding: 1px 6px
    min-width: 42px
    border: 1px solid transparent
    border-radius: 10px
    text-align: center
    cursor: pointer

.color-btn:hover
    top: -3px

.color-btn.preferred
    color: $white
    background-color: $sch-purple

//only important if user selects agains their system
// .color-btn.selected
//     color: $sch-purple
</style>