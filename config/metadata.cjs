const {
  author,
  description,
  name,
  repository,
  version,
  license
} = require("../package.json");

module.exports = {
  name: name,
  description: description,
  namespace: "http://tampermonkey.net/",
  version: version,
  author: author,
  icon: "https://www.falinks-teambuilder.com/favicon.ico",
  source: repository.url,
  license: license,
  match: [
    "http*://play.pokemonshowdown.com/*",
    "http*://*.psim.us/*",
    "http*://pokepast.es/*",
    "http*://play.limitlesstcg.com/*",
  ],
  require: ["https://unpkg.com/@pkmn/sets/build/index.min.js"],
  connect: ["www.falinks-teambuilder.com"],
  "run-at": "document-end",
};
