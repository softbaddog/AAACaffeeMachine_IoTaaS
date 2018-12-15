const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const devicesRouter = require('./routes/devices');
const adminRouter = require('./routes/admin');

const auth = require('./iotplatform/auth');
const sub = require('./iotplatform/sub');

const app = express();

mongoose.connect('mongodb://localhost/AAA', {
  useNewUrlParser: true,
  useCreateIndex: true
});

mongoose.connection.once('open', () => {
  console.log("MongoDB connected success.")
});

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require('moment');

app.use('/', indexRouter);
app.use('/devices', devicesRouter);
app.use('/admin', adminRouter);

// After fetchAccessToken, subscribe notifyType
auth.fetchAccessToken().then(() => {
  console.log("subscribe is coming...");
  for (const item of sub.notifyTypeList) {
    if (item.enabled) {
      sub.subscribe(auth.loginInfo, item.notifyType);
    }
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
