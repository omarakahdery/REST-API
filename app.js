const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

// to pars req
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// to store public file
app.use(express.static("public"));

//to connect to the db
mongoose.connect("mongodb://localhost:27017/wikidb", { useNewUrlParser: true });

//to Create schema
const articleSchema = {
  title: String,
  content: String,
};

//to Create the modlle
const Article = mongoose.model("Article", articleSchema);

//TODO/////////////////////////////
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(`err${err}`);
      }
    });
  })
  .post(function (req, res) {
    newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("a new article successfully added ");
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("All articles successfully deleted ");
      } else {
        res.send(err);
      }
    });
  })
  .app.listen(3000, function () {
    console.log("Server started on port 3000");
  });
