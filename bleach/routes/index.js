const express = require('express');
const router = express.Router();
var db = require('../mySQLConnect.js');
// const Bleach = require("../models/bleach").Bleach;
// const User = require("../models/user").User;

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    req.session.greeting = "Hi!!!";
    res.render('index', { title: 'Bleach', counter:req.session.counter });
  } 
  catch (err) {
    next(err);
  }
});

/* GET login/registration page. */
router.get('/logreg', async function(req, res, next) {
  res.render('logreg', { title: 'Вход',error:null}); 
});

/* POST login/registration page. */
router.post('/logreg', async function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  db.query(`SELECT * FROM user WHERE user.username = '${req.body.username}'`, function(err, users) {
    if (err) return next(err);
    if (users.length > 0) {
      var user = users[0];
      if (password == user.password) {
        req.session.user = user.id;
        res.redirect('/');
      } else {
        // Неправильный пароль
        res.render('logreg', { title: 'Вход', error: 'Неверный пароль' });
      }
    } else {
      db.query(`INSERT INTO user (username, password) VALUES ('${username}', '${password}')`, function(err, user) {
        if (err) return next(err);
        req.session.user = user.id;
        res.redirect('/');
      });
    }
  });
});



//   try {
//       const user = await User.findOne({ username });

//       if (user) {
//           if (user.checkPassword(password)) {
//               req.session.user = user._id;
//               res.redirect('/');
//           } else {
//               res.render('logreg', { title: 'Вход', error: 'Неверный пароль' });
//           }
//       } else {
//           const newUser = new User({ username, password });
//           await newUser.save();
//           req.session.user = newUser._id;
//           res.redirect('/');
//       }
//   } catch (err) {
//       next(err);
//   }
// });

router.get('/logreg', function(req, res, next) {
  res.render('logreg',{error:null});
});
   
/* POST logout. */
router.post('/logout', function(req, res, next) {
  req.session.destroy();
  res.locals.user = null;
  res.redirect('/');
});

module.exports = router;