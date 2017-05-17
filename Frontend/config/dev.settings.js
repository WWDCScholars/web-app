const prod = require('./prod.settings')

// Overwrite production settings here
module.exports = Object.assign(prod, {
  cloudKit: {
    containerIdentifier: 'iCloud.de.moritzsternemann.WWDCScholars',
    apiToken: '34c08356c27f70833a62c044a950d999eceeba5bebf671908850c49289f5a158',
    environment: 'development'
  }
})
