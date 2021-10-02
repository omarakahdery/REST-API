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

//to Create the model
const Article = mongoose.model("Article", articleSchema);

//------------------------------
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
  });
//============================ Req a specific article ==============================
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (!err) {
          res.send(foundArticle);
        } else {
          res.send("No article with this title");
        }
      }
    );
  })
  .put(function (req, res) {
    let article_to_update = req.params.articleTitle;
    let new_title = req.body.title;
    let new_content = req.body.content;

    Article.findOneAndUpdate(
      { title: article_to_update },
      { title: new_title, content: new_content },
      { overwrite: true },
      function (error) {
        if (!error) {
          res.send("The article uccessfully Updated ");
        } else {
          res.send(error);
        }
      }
    );
  })
  .patch(function (req, res) {
    let article_to_update = req.params.articleTitle;
    Article.findOneAndUpdate(
      { title: article_to_update },
      { $set: req.body },
      function (error) {
        if (!error) {
          res.send("The article uccessfully Updated ");
        } else {
          res.send(error);
        }
      }
    );
  })
  .delete(function (req, res) {
    let article_to_update = req.params.articleTitle;
    Article.deleteOne({ title: article_to_update }, function (error) {
      if (!error) {
        res.send("The article uccessfully deleted ");
      } else {
        res.send(error);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
