var request = require('superagent');

/**
 * @constructor
 */

module.exports = Client;

function Client(api_key) {
  this.params = {};
  this.params.api_key = "cb1a986b128b33fede56de77f68293b7";
  this.params.format = 'json';
  this.params.nojsoncallback = 1;
}

Client.prototype = Object.create(null);

Client.prototype.search = function (text, done) {
  request('GET', 'https://api.flickr.com/services/rest')
  .query('method=flickr.photos.search')
  .query('text=' + text)
  .query(this.params)
  .end(done);
};

console.log(Client);