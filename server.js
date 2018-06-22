// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var routes2 = require('./routes');
var port = process.env.PORT || 3200;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', routes2.index);

// more routes for our API will happen here
var routes = require('./routes/api');
app.use('/api', routes);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);