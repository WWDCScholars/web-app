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

export const routeMatchYear = (years: CloudKit.Reference[], routeYear?: string): CloudKit.Reference | undefined => {
  if (!years.length) return undefined

  if (routeYear) {
    return years.find(wwdcYear => wwdcYear.recordName.substring(5) === routeYear)
  }

  // else, return last year
  const sortedYears = years
    .slice()
    .sort((lhs, rhs) => lhs.recordName.localeCompare(rhs.recordName))
  return sortedYears[sortedYears.length - 1]
}

export const yearMatchYearInfo = (yearInfos: CloudKit.Reference[], years: CloudKit.Reference[], wwdcYearRecordName: string): CloudKit.Reference | undefined => {
  if (!yearInfos.length || !years.length || yearInfos.length != years.length) return undefined

  const yearIndex = years.findIndex(year => year.recordName === wwdcYearRecordName)
  if (yearIndex < 0) return undefined

  return yearInfos[yearIndex]
}
