import Codebird from 'codebird'
import { settings } from 'config'

class Twitter {
  constructor () {
    this._cb = new Codebird()
    this._cb.setConsumerKey(settings.twitter.consumerKey, settings.twitter.consumerSecret)
  }

  async searchTweets (query) {
    return this._call('search_tweets', { q: query, count: 20 })
  }

  _call (method, params) {
    return new Promise((resolve, reject) => {
      this._cb.__call(method, params, (reply) => {
        resolve(reply)
      })
    })
  }
}

export default Twitter
