var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// Import the routes express gen
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const gameRouter = require('./routes/gameroute');
const woordRouter = require('./routes/woordenroute');
var CheckUsernameRouter = require('./routes/CheckUsername');  //checjk email route

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
app.use('/api/Woordenlijst', gameRouter);
app.use('/api/woordenNL', woordRouter);


//check username
app.use('/api', CheckUsernameRouter);  //checkusername route


module.exports = app;
