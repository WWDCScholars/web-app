import { Vue } from 'nuxt-property-decorator'

declare function SettingGetter(key: string): any

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue> {
    $s: typeof SettingGetter
  }

  interface Vue {
    $s: typeof SettingGetter
  }
}
