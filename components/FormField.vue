<template lang="pug">
.field
  slot
  .input-error(v-if="error") {{ error }}
  .comment(v-if="comment") {{ comment }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class FormField extends Vue {
  @Prop({ default: '' })
  error!: string
  @Prop({ default: '' })
  comment!: string
}
</script>

<style lang="sass" scoped>
.input-error
  font-size: 0.8em
  margin-left: 2px
  margin-top: 15px
  color: $sch-red1

/deep/ .comment
  color: $sch-gray
  margin-top: 15px
  font-size: 1em
</style>

