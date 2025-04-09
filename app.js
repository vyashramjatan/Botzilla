var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// Import the routes express gen
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const woordRouter = require('./routes/WoordenNL');
const AIwoordRouter = require('./routes/AIWoordenNL');
const ENGAIwoordRouter = require('./routes/AIWoordenENG');
const ENGwoordRouter = require('./routes/WoordenENG');
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
app.use('/api/Woordenlijst', woordRouter);
app.use('/api/woordenNL', AIwoordRouter);
app.use('/api/woordenENG', ENGwoordRouter);
app.use('/api/ENGWoordenlijstAI', ENGAIwoordRouter);


//check username
app.use('/api', CheckUsernameRouter);
//register route
app.use('/api', registerANDcrosscheck);


module.exports = app;
