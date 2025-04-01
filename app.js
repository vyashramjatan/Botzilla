var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// Import the routes express gen
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var CheckUsernameRouter = require('./routes/CheckUsername');  //checjk email route
var registerANDcrosscheck = require('./routes/registerANDcrosscheck'); //register route

var app = express();

// Middleware setup
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Register routes express gen
app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);


//check username
app.use('/api', CheckUsernameRouter);
//register route
app.use('/api', registerANDcrosscheck);


module.exports = app;
