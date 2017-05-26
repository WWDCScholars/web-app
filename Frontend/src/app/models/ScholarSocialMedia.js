import cloudkit from 'js-cloudkit'

const scholarSocialMediaSchema = cloudkit.Record.extend({
  facebook: String,
  github: String,
  imessage: String,
  itunes: String,
  linkedin: String,
  twitter: String,
  website: String,
  scholar: cloudkit.Data.Reference
})

module.exports = cloudkit.model('ScholarSocialMedia', scholarSocialMediaSchema)
