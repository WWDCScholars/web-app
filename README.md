<p align="center"><a href="https://www.wwdcscholars.com" target="\_blank"><img width="90" height="90" src="https://raw.githubusercontent.com/WWDCScholars/web-app/master/.github/logo.png"></a></p>

# [WWDCScholars Website](https://www.wwdcscholars.com) &middot; [![Netlify Status](https://api.netlify.com/api/v1/badges/dfda3ed0-fe8b-4cc7-a051-f39126a20128/deploy-status)](https://app.netlify.com/sites/wwdcscholars/deploys)
WWDCScholars is a community of [Apple WWDC Scholarship](https://developer.apple.com/wwdc/scholarships/) winners. Every year bright minds from all around the world compete against each other for a free ticket to Apple's yearly developers conference. The scholarship recipients share their winning projects in [our iOS App](https://itunes.apple.com/us/app/scholars-of-wwdc/id999731893?mt=8) and on [our website (www.wwdcscholars.com)](https://www.wwdcscholars.com).

This repository contains the [Vue.js](https://vuejs.org) based website that lists current and previous scholarship winners from all around the world.

## Getting Started
WWDCScholars is based on [Apple's BaaS, CloudKit](https://developer.apple.com/icloud/cloudkit/). To use this project you need to obtain credentials for [CloudKit](https://developer.apple.com/library/content/documentation/DataManagement/Conceptual/CloudKitQuickStart/Introduction/Introduction.html#//apple_ref/doc/uid/TP40014987), the [Google Maps API](https://developers.google.com/maps/) and the [Sentry Error Tracking Service](https://sentry.io/).

#### Create a `.env` file at the root of this project that looks like this:
```
CLOUDKIT_CONTAINER_IDENTIFIER="<CloudKit Container Identifier>"
CLOUDKIT_API_TOKEN="<CloudKit API Token>"
CLOUDKIT_ENVIRONMENT="<CloudKit Environment>"

GOOGLE_MAPS_API_KEY="<Google Maps API Key>"

SENTRY_DSN="<Sentry DSN>"
SENTRY_ENVIRONMENT="<Sentry Environment>"

WWDC_YEAR="<The WWDCYear key to use>"
```

#### Install dependencies
```
$ yarn install // or npm
```

#### Build and run the app
- In development mode using a local development server with hot-reload, etc.
  ```
  $ yarn dev
  ```
- In production mode for static hosting
  ```
  $ yarn generate
  ```
- In production mode with server-side rendering support
  ```
  $ yarn build
  $ yarn start // start the server
  ```
When building for production you can find the results in `dist/`.

A 404 page can be found at `dist/404.html`. You can use it in nginx like this:
```
server {
  ...
  root /path/to/build/output;
  error_page 404 /404.html;
}
```

## Contributing
We are always on the lookout for new ideas and improvements to the current version of this project. Do you want to help us shape the future of WWDCScholars? Check out what we are currently working on in the [issues](https://github.com/WWDCScholars/web-app/issues).

In case you have a technical question or need some guidance, don't hesitate to open a new issue yourselves.

## Author
I'm [Moritz Sternemann](https://github.com/moritzsternemann), a computer-science student at [Technical University of Munich](https://www.tum.de/).
- GitHub: [@moritzsternemann](https://github.com/moritzsternemann)
- Email: [opensource@moritzsternemann.de](mailto:opensource@moritzsternemann.de)
- Twitter: [@strnmn](https://twitter.com/strnmn)

## Related Projects
- [iOS App (github.com/WWDCScholars/iOS-app)](https://github.com/WWDCScholars/iOS-app)
- [Form (github.com/WWDCScholars/web-form)](https://github.com/WWDCScholars/web-form)

## License
The *WWDCScholars Website* is available under the MIT license. See the [LICENSE](https://github.com/WWDCScholars/web-app/blob/master/LICENSE) file for more information.
