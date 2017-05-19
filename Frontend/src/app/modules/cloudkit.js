import { settings } from 'config'
import { connection } from 'js-cloudkit'

// Import models
import '../models/Scholar'
import '../models/ScholarSocialMedia'
import '../models/User'
import '../models/WWDCYear'
import '../models/WWDCYearInfo'

connection.init(settings.cloudKit)

export default connection
