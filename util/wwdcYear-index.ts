import { CloudKit } from '@wwdcscholars/cloudkit'

export default function (years: [CloudKit.Reference, CloudKit.Reference][], year?: string): [CloudKit.Reference, CloudKit.Reference] | null {
  if (!years.length) return null

  if (year) {
    // recordName e.g. 'WWDC 2019', year e.g. '2019'
    return years.find(y => y[0].recordName.substring(5) === year) || null
  }

  // else return last index
  const sortedYears = years.slice().sort((lhs, rhs) => lhs[0].recordName.localeCompare(rhs[0].recordName))
  return sortedYears[sortedYears.length - 1]
}
