const express = require("express"),
			app = express(),
			exphbs = require("express-handlebars"),
      bodyParser = require("body-parser"),
			fs = require("fs"),
      fetch = require('node-fetch');


// The extensions 'html' allows us to serve file without adding .html at the end 
// i.e /my-cv will server /my-cv.html
app.use(express.static("public", {'extensions': ['html']}));
app.use(bodyParser.urlencoded({extended: true}));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//      VARIABLES
  
const filePath = __dirname + "/data/posts.json";



//			ROUTES

app.get("/", (req, res) => {
  const callbackFunction = (error, file) => {
    // we call .toString() to turn the file buffer to a String
    const fileData = file.toString();
    // we use JSON.parse to get an object out the String
    const postsJson = JSON.parse(fileData);
    // send the json to the Template to render
    res.render("index", {
      title: "Eugene", // insert your name instead
      posts: postsJson
    });
  };
  fs.readFile(filePath, callbackFunction);
});


app.get("/my-cv", (req, res) => { res.render("my-cv", { title: "Eugene" }) });


app.get("/admin", (req, res) => { res.render("admin") });


app.get("/contact", (req, res) => res.render("contact"));


app.get("/posts", (req, res) => res.sendFile(filePath));

app.get("/ol-posts", (req, res) => {
  const olenaJson = "https://radiant-tor-44272.herokuapp.com/posts";

  fetch(olenaJson)
    .then(function(res) {
        return res.json();
    }).then(function(body) {
        res.send(body)
    }).catch(function(err) {
        console.log(err);
    });
});


app.post("/posts", (req, res) => {
  // let title = req.body.title;
  // console.log(title);
  let newPost = {
    id: Math.floor((Math.random()*1000) + 6),
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content
  };

  fs.readFile(filePath, (error, file) => {
    const parsedFile = JSON.parse(file.toString());
    parsedFile.splice(0, 0, newPost);

    fs.writeFile(filePath, JSON.stringify(parsedFile, null, 2), error => {});
    res.redirect("/");
  });
});

app.get("/posts/:postId", (req, res) => {
  let postId = req.params.postId;
  fs.readFile(filePath, (error, file) => {
    const parsedFile = JSON.parse(file);
    // console.log(parsedFile);
    parsedFile.forEach(post => {
      if(post.id === postId){
        res.send(post);
      }
    });
  });
});







// what does this line mean: process.env.PORT || 3000
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on port 3000. Ready to accept requests!`);
});