var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('../config');
var passport = require('passport');
var session = require('express-session');

var app = express();

// Routes
var indexRouter = require('./routes/index');
var localAuthRouter = require('./routes/local-auth');
var postsRouter = require('./routes/posts');
var rRouter = require('./routes/r');
var submitRouter = require('./routes/submit');
var uRouter = require('./routes/u');
var subpylistRouter = require('./routes/subpylist');
var commentsRouter = require('./routes/comments');

// passport.js
require('./passport.js')(passport);
app.use(session({ secret: 'hamster kitten fight' }));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// serve static content
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(express.static(path.join(__dirname, '..', 'client/build')));

// use routes
app.use('/', indexRouter);
app.use('/', localAuthRouter);
app.use('/r', rRouter);
app.use('/r', submitRouter);
app.use('/u', uRouter);
app.use('/posts', postsRouter);
app.use('/subpylist', subpylistRouter);
app.use('/comments', commentsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(config.port);

console.log();
console.log();
console.log('------------------------------')
console.log('SENCHA listening on port ' + config.port);
console.log('------------------------------')
