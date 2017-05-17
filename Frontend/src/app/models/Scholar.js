import { model, Data, Record } from 'js-cloudkit'
const Reference = Data.Reference
const Location = Data.Location

const scholarSchema = Record.extend({
  firstName: String,
  lastName: String,
  email: String,
  gender: String,
  birthday: Date,
  location: Location,
  shortBio: String,
  socialMedia: Reference,
  wwdcYearInfos: [Reference],
  wwdcYears: [Reference]
})

module.exports = model('Scholar', scholarSchema)
