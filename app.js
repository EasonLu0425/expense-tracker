const express = require("express");
const app = express();
const routes = require("./routes");
const session = require("express-session");
const exphbs = require("express-handlebars");
const methhodOverride = require("method-override");
const flash = require("connect-flash");
const usePassport = require("./config/passport");
const port = 3000;


require("./config/mongoose");

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methhodOverride("_method"));
app.use(flash());
usePassport(app);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});
app.use(routes);

app.listen(port, () => {
  console.log(`The web is on localhost:${port}`);
});
