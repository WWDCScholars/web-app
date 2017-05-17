import cloudkit from 'js-cloudkit'

const userSchema = cloudkit.Record.extend({
  scholar: cloudkit.Data.Reference
})

module.exports = cloudkit.model('Users', userSchema)
