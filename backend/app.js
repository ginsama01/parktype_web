var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var FileStore = require('session-file-store')(session);
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ownRouter = require('./routes/park.owner.router');
var parkUserRouter = require('./routes/park.user.router');
var parkAdminRouter = require('./routes/park.admin.router');
var accountAdminRouter = require('./routes/account.admin.router');
var accountUserRouter = require('./routes/account.user.router');
var chartRouter = require('./routes/chart.admin.router');
var authenRouter = require('./routes/authen.router');
var uploadRouter = require('./routes/upload.park.image.router');
var config = require('./config');
const { cors, corsWithOptions } = require('./routes/cors');

var app = express();

app.use(corsWithOptions);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(config.cookieKey));

app.use('/', indexRouter);

app.use('/authen', authenRouter);


app.use('/users', usersRouter);
app.use('/owner/parks', ownRouter);
app.use('/parks', parkUserRouter);
app.use('/accounts', accountUserRouter);
app.use('/admin/parks', parkAdminRouter);
app.use('/admin/accounts', accountAdminRouter);
app.use('/admin/charts', chartRouter);
app.use('/upload/parks', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;