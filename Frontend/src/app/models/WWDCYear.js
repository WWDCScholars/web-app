import cloudkit from 'js-cloudkit'

const wwdcYearSchema = cloudkit.Record.extend({
  name: String,
  year: String
})

module.exports = cloudkit.model('WWDCYear', wwdcYearSchema)
