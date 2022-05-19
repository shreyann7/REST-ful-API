//jshint esversion:6

//in restful api
// C --> Post
// R --> Get
// U --> Put
// D --> Delete

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

  //GET
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      // console.log(foundArticles);
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  //POST
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        console.log("Succesfully Posted new Article");
      } else {
        console.log(err);
      }
    });
  })
  //DELETE
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        console.log("Succesfully deleted All Articles");
      } else {
        console.log(err);
      }
    });
  });

// ////SPECIFIC ARTICLES////

app.route("/articles/:articleTitle")

.get(function (req, res) {
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      }
      else{
        console.log("NO SUCH ARTICLE FOUND");
      }
    })
  })

.put(function(req,res){
    Article.replaceOne (
      {title:req.params.articleTitle},
      {
        title: req.body.title , content: req.body.content
      },
      {overwrite:true},
      function(err){
        if(!err){
          console.log("Succesfully Updated");
        }
        else{
          console.log(err);
        }
      }
    )
  })

  .patch(function(req,res){
    Article.replaceOne(
      
      {title : req.params.title},
      {$set: req.body},
      function(err){
      if(!err){
        res.send("Succesfully Updated Article");
      }
      else{
        res.send(err);
      }
  })
  })

  .delete(function(req,res){
    Article.deleteOne(function(err){
      if(!err){
        res.send("Sucessfully Deleted");
      }
      else{
        res.send(err);
      }
    })
  })


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
