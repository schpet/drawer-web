// from https://ninja.sg/spa-router-fallback/
//
// this is here, along with
// "express": "^4.13.4",
// "express-history-api-fallback": "^2.0.0",
// in the package.json to let heroku run the app.
//
// hopefully in the future it will be replaced by some sort of
// universal rendering setup.

var fallback = require('express-history-api-fallback')
var express = require('express')
var app = express()
var root = __dirname + '/dist'

app.set('port', (process.env.PORT || 5000))
app.use(express.static(root))
app.use(fallback('index.html', { root: root }))

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
