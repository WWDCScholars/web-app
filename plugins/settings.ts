import Vue from 'vue'
import _get from 'lodash/get'
import settings from '~/settings.json'

function getSetting(key: string): any {
  const val = _get(settings, key, '')
  if (!val) throw new Error(`[Settings]: '${key}' is empty.`)
  return val || key
}

Vue.prototype.$s = getSetting
Vue.$s = getSetting
