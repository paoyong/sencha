var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var passport = require('passport');
var session = require('express-session');

var app = express();

var indexRouter = require('./routes/index');
var localAuthRouter = require('./routes/local-auth');
var postsRouter = require('./routes/posts');
var rRouter = require('./routes/r');
var submitRouter = require('./routes/submit');
var uRouter = require('./routes/u');
var subpylistRouter = require('./routes/subpylist')

require('./passport.js')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'hamster kitten fight' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', localAuthRouter);
app.use('/r', rRouter);
app.use('/r', submitRouter);
app.use('/u', uRouter);
app.use('/posts', postsRouter);
app.use('/subpylist', subpylistRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

app.listen(config.port);

console.log();
console.log();
console.log('------------------------------')
console.log('PYRAMUS listening on port ' + config.port);
console.log('------------------------------')
