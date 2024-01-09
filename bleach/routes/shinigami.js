const express = require('express');
const router = express.Router();
const Bleach = require("../models/bleach").Bleach;
const async = require("async");
var checkAuth = require("./../middleware/checkAuth.js");

router.get('/:nick', checkAuth, async function(req, res, next) {
  try {
    const [bleach, shinigami] = await Promise.all([
      Bleach.findOne({nick: req.params.nick}),
      Bleach.find({}, {_id: 0, title: 1, nick: 1})
    ]);
    if (!bleach) {
      throw new Error("Нет такого Шинигами");
    }
    renderBleach(res, bleach.title, bleach.avatar, bleach.desc, shinigami);
  } catch (err) {
    next(err);
  }
});

function renderBleach(res, title, picture, desc, shinigami) {
  console.log(shinigami);
  res.render('bleach', {
    title: title,
    picture: picture,
    desc: desc,
    // menu: shinigami,
  });
}

module.exports = router;
