//Dependencies
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let logger = require('morgan');
let config = require('./config');
let homeRoute = require('./routes/homeRoute');

//Initialize express app;
const app = express();

//Connect to database;
mongoose.connect(config.DATABASE_URI);

//Use Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Logger middleware
app.use(logger('dev'));

//Set App routes
app.use('/', homeRoute)

//Start server to listen HTTP requests
app.listen(config.PORT, () => {
  console.log("Server is LIVE at port "+config.PORT);
});
