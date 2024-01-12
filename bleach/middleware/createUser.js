module.exports = function(req,res,next) {
res.locals.user = null
// User.findById(req.session.user, function (err, user) { // if (err)
// return next(err)
// res.locals.user = user;
// next();
// })
next();
}

// const User = require("../models/user").User;

// module.exports = async function(req, res, next) {
//   try {
//     res.locals.user = [];
//     const user = await User.findById(req.session.user);
//     res.locals.user = user;
//     next();
//   } catch (err) {
//     next(err);
//   }
// };