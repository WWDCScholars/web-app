import cloudkit from 'js-cloudkit'
const Reference = cloudkit.Data.Reference
const Asset = cloudkit.Data.Asset

const wwdcYearInfoSchema = cloudkit.Record.extend({
  acceptanceEmail: Asset,
  appliedAs: String,
  githubAppLink: String,
  profilePicture: Asset,
  screenshots: [Asset],
  videoLink: String,
  scholar: Reference,
  year: Reference
})

module.exports = cloudkit.model('WWDCYearInfo', wwdcYearInfoSchema)
