<template lang="pug">
.tab-bar-container
  tab-bar
    slot
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TabBar from './TabBar.vue'

@Component({
  components: { TabBar }
})
export default class NavigationTabBar extends Vue {}
</script>

<style lang="sass" scoped>
.tab-bar-container
  width: 100%
  text-align: center
  background-color: $white
  box-shadow: 0 2px 4px 0 transparentize($sch-gray, 0.6)
</style>
