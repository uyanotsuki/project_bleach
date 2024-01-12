var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// подключаем бд
// var mongoose = require('mongoose')                
// mongoose.connect('mongodb://localhost/bleachDB')

const session = require("express-session")
var MySQLStore = require('express-mysql-session')(session); 
var mysql2 = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shinigami = require('./routes/shinigami');

var app = express();
var options = {
  host : '127.0.0.1',
  port: '3306',
  user : 'root',
  password : 'root',
  database: 'bleachdb'
};
var connection = mysql2.createPool(options);
var sessionStore = new MySQLStore( options, connection);

// view engine setup
app.engine('ejs',require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Bleach',
  key: 'sid',
  store: sessionStore,
  resave: true,
  saveUninitialized: true,
  cookie: { path: '/',
    httpOnly: true,
    maxAge: 60*1000
  } 
}));
var MySQLStore = require('express-mysql-session')(session);

// var MongoStore = require('connect-mongo');
// app.use(session({
//   secret: "Bleach",       //для подписи и шифрования данных сессии
//   cookie: {               //максимальное время жизни куки сессии
//     maxAge: 60 * 1000,        
//   },
//   resave: true,             //сессия будет пересохраняться даже при каждом запросе
//   saveUninitialized: true,   //сессии будут сохраняться даже тогда, когда они не были явно изменены
//   store: MongoStore.create({mongoUrl: 'mongodb://localhost/bleachDB'})
// }));
app.use(function(req,res,next){
  req.session.counter = req.session.counter +1 || 1
  next()
});
app.use(require("./middleware/createMenu.js")); //подключение глобальной переменной для массива ссылок меню 
app.use(require("./middleware/createUser.js"));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/shinigami', shinigami);

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
