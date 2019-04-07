<template lang="pug">
.container-fluid
  profile-submission(year="2017")
  profile-submission(year="2016")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import {
  ProfileSubmission
} from '~/components'

@Component({
  components: {
    ProfileSubmission
  }
})
export default class PageProfileSocial extends Vue {}
</script>

<style lang="sass" scoped></style>
