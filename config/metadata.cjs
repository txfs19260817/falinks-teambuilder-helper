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
    "http*://play.pokemonshowdown.com/*", // /teambuilder
    "http*://*.psim.us/*",
    "http*://pokepast.es/*",
  ],
  require: [],
  grant: ["GM.xmlHttpRequest"],
  connect: ["www.falinks-teambuilder.com", "httpbin.org"],
  "run-at": "document-end",
};
