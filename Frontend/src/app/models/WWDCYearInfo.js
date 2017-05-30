import cloudkit from 'js-cloudkit'
const Reference = cloudkit.Data.Reference
const Asset = cloudkit.Data.Asset

const wwdcYearInfoSchema = cloudkit.Record.extend({
  acceptanceEmail: Asset,
  appliedAs: { type: String, enum: ['student', 'stem', 'both'] },
  githubAppLink: String,
  profilePicture: Asset,
  screenshots: [Asset],
  videoLink: String,
  scholar: Reference,
  year: Reference,
  appStoreSubmissionLink: String,
  appType: { type: String, enum: ['both', 'offline', 'online'] }
})

module.exports = cloudkit.model('WWDCYearInfo', wwdcYearInfoSchema)
