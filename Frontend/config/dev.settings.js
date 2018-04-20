const prod = require('./prod.settings')

// Overwrite production settings here
module.exports = Object.assign(prod, {
  cloudKit: {
    // de.moritzsternemann
    // containerIdentifier: 'iCloud.de.moritzsternemann.WWDCScholars',
    // apiToken: '34c08356c27f70833a62c044a950d999eceeba5bebf671908850c49289f5a158',
    // com.wwdcscholars
    containerIdentifier: 'iCloud.com.wwdcscholars.WWDCScholars',
    apiToken: '4b05d3b2bf17bb717dfc36da0f7e6f665936d5c85c57b2d7a7483bb3fcbc7ba8',
    environment: 'development'
  },
  twitter: {
    consumerKey: 'uKap38VNuhy0m7XQjOVggtYtf',
    consumerSecret: 'RUhHbseoJQcZV4V8zWhvZ8DvDjSVODr3YXqy3BiL83DJr7l6hd'
  }
})
