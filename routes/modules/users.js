const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../../models/users");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get('/logout',(req, res) => {
  req.logout(err => {
    if (err) {return next(err)}
  })
  req.flash("success_msg", "您已成功登出。");
  res.redirect('/login')
})

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: `所有欄位都是必填的!` });
  }
  if (password !== confirmPassword) {
    errors.push({ message: `密碼與確認密碼不符。` });
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      errors.push({ message: "這個 Email 已經註冊過了。" });
      return res.render("register", {
        errors,
        name,
        email,
        password,
        confirmPassword,
      });
    }
    return bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) => {
        User.create({
          name,
          email,
          password: hash,
        });
      })
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  });
});

module.exports = router;
