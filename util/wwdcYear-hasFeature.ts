import { WWDCYear } from '@wwdcscholars/cloudkit'

declare module '@wwdcscholars/cloudkit' {
  interface WWDCYear {
    hasFeature(featureName: string): boolean
  }
}
WWDCYear.prototype.hasFeature = function (featureName): boolean {
  if (!this.features) {
    return false
  }
  return this.features.includes(featureName)
}
