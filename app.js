var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ProductRouter = require('./routes/products');
var myProductRouter = require('./routes/myproduct');
const searchRouter=require('./routes/search')
const CommentRouter=require('./routes/Comment')
const cartRouter=require('./routes/Cart')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use('/img',express.static(__dirname+'/users'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/Comment', CommentRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', ProductRouter);
app.use('/myproduct', myProductRouter);
app.use('/search',searchRouter);
app.use('/Cart',cartRouter);
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
  res.redirect('/');
});

module.exports = app;
