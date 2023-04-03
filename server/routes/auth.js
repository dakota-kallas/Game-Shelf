var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");

const multer = require("multer");
const upload = multer();

router.post("/login", upload.none(), (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, function (err, user) {
    if (err) {
      console.error(err);
    } else {
      console.log(user);
    }
  });

  // const ERROR = `Invalid credentials`;

  // if (user) {
  //   bcrypt.compare(password, user.password, function (err, result) {
  //     if (err) {
  //       res.status(401).send(new ErrorReport.Error(ERROR));
  //     } else if (result) {
  //       req.session.regenerate(() => {
  //         delete user.password;
  //         req.session.user = user;
  //         res.json(user);
  //       });
  //     } else {
  //       res.status(401).send(new ErrorReport.Error(ERROR));
  //     }
  //   });
  // } else {
  //   res.status(401).send(new ErrorReport.Error(ERROR));
  // }
});

module.exports = router;
