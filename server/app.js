var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* express-session 모듈 사용 */
var session = require("express-session")
var MysqlStore = require("express-mysql-session")(session)
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'itc801',
  database: 'board'
};
var sessionStore = new MysqlStore(options)

/* sequelize로 MySQL(데이터베이스)을 연결함 */
const { Sequelize } = require('sequelize');
global.sequelize = new Sequelize('board', 'root', 'itc801', {
  host: 'localhost',
  dialect: "mysql",
  logging: false
});

/* require()를 통해 model.js를 불러옴 */
require("./model.js")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');

var app = express();
app.use(session({
  key: 'session_cookie_name', // 아무거나 넣어도 되지만 바뀌면 안 됨 
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

console.log(path.join(__dirname, "../../test"))
console.log(__filename)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist'))); // app.js의 상위(보드), 상위(클라이언트) 경로의 dist라는 파일

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/board', boardRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
