<template>
<div class="container-fluid">
  <div class="section">
    <h1>Imprint</h1>

    <h2>Information pursuant to § 5 TMG</h2>
    <p>Sam Eckert<br />
    Lindpaintnerstrasse 88<br />
    70195 Stuttgart</p>

    <h2>Contact</h2>
    <p>Email: team@WWDCScholars.com</p>

    <h2>EU dispute resolution</h2>
    <p>The European Commission provides a platform for online dispute resolution (ODR): <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>.<br /> Our e-mail address can be found above in the site notice.</p>

    <p>We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p>

    <h3>Liability for Contents</h3> <p>As service providers, we are liable for own contents of these websites according to Paragraph 7, Sect. 1 German Telemedia Act (TMG). However, according to Paragraphs 8 to 10 German Telemedia Act (TMG), service providers are not obligated to permanently monitor submitted or stored information or to search for evidences that indicate illegal activities.</p> <p>Legal obligations to removing information or to blocking the use of information remain unchallenged. In this case, liability is only possible at the time of knowledge about a specific violation of law. Illegal contents will be removed immediately at the time we get knowledge of them.</p> <h3>Liability for Links</h3> <p>Our offer includes links to external third party websites. We have no influence on the contents of those websites, therefore we cannot guarantee for those contents. Providers or administrators of linked websites are always responsible for their own contents.</p> <p>The linked websites had been checked for possible violations of law at the time of the establishment of the link. Illegal contents were not detected at the time of the linking. A permanent monitoring of the contents of linked websites cannot be imposed without reasonable indications that there has been a violation of law. Illegal links will be removed immediately at the time we get knowledge of them.</p> <h3>Copyright</h3> <p>Contents and compilations published on these websites by the providers are subject to German copyright laws. Reproduction, editing, distribution as well as the use of any kind outside the scope of the copyright law require a written permission of the author or originator. Downloads and copies of these websites are permitted for private use only.<br /> The commercial use of our contents without permission of the originator is prohibited.</p> <p>Copyright laws of third parties are respected as long as the contents on these websites do not originate from the provider. Contributions of third parties on this site are indicated as such. However, if you notice any violations of copyright law, please inform us. Such contents will be removed immediately.</p>

    <i>Note: The WWDCScholars project is not affiliated with Apple Inc. in any way.</i>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'

@Component
export default class PageImprint extends Vue {
  head(): MetaInfo {
    return { title: 'Imprint | WWDCScholars' }
  }
}
</script>

<style lang="sass" scoped>
.section
  max-width: 900px
  margin: 0 auto

  h1, h2, h3
    color: $sch-blue

  h2
    text-align: left
    font-size: 1.4em
    margin-bottom: 0.5em

  h3
    font-size: 1.2em
    font-weight: 500

  a
    color: $sch-blue

  +for-phone-only
    padding: 0 15px

    h1, h2, h3
      padding: 0
</style>
