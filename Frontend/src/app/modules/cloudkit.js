import { settings } from 'config'
import { connection } from 'js-cloudkit'

// Import models
import '../models/Scholar'

connection.init(settings.cloudKit)
  .then(async () => {
    console.log('cloudkit initialized')
  })

export default connection
