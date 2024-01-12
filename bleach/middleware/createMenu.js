const db = require('./../mySQLConnect'); // assuming MySQL database connection

module.exports = function(req, res, next) {
    res.locals.nav = [];
    db.query('SELECT bleaches.title, bleaches.nick FROM bleaches', function(err, result) {
        if (err) throw err;
        res.locals.nav = result;
        next();
    });
};

// const Bleach = require("./../models/bleach").Bleach;

// module.exports = async function(req, res, next) {
//     try {
//       res.locals.nav = [];
//       const result = await Bleach.find(null, { _id: 0, title: 1, nick: 1 });
//       res.locals.nav = result;
//       next();

//     } catch (err) {
//       throw err;
//     }
// };