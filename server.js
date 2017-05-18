const express = require('express');
const app = express();
// const env = require('env2')('./.env');
// console.log(process.env.API_KEY);

const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);
const multer = require('multer');

var storage =  multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage }).array('userPhoto',2);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use("/", express.static(__dirname + '/')); //so uploads can be viewed
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

app.use(session({
  secret: 'super_secred_string',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// var db = pgp('postgres://liz@localhost:5432/project4_db');

// app.listen(3000, function () {
//   console.log('Server running, listening on port 3000 ┬──┬◡ﾉ(°-°ﾉ)');
// });
app.listen(80, function () {
  console.log('Server running, listening on port 80 on heroku ┬──┬◡ﾉ(°-°ﾉ)');
});

app.get('/', function(req, res){
    res.render('user/index');
});


// app.get('/login', function(req, res){
//   if(req.session.user){
//     let data = {
//       "logged_in": true,
//       "email": req.session.user.email
//     };
//     res.render('login/index', data);
//   } else {
//     res.render('login/index');
//   }
// });

app.get('/user', function(req, res){
  if(req.session.user){
    let data = {
      "logged_in": true,
      "email": req.session.user.email
    };
    res.render('user/index', data);
  } else {
    res.render('user/index');
  }
});

app.get('/user', function(req, res){
  res.render('user/index');
});

app.get('/user/success', function(req, res){
  res.render('user/success');
});

app.get('/user/tryagain', function(req, res){
  res.render('user/tryagain');
});

app.put('/user', function(req, res){
  db
    .none("UPDATE users SET email = $1 WHERE email = $2",
      [req.body.email, req.session.user.email])
      .then(function(){
      res.redirect("/user/success");
    })
      .catch(function(){
        res.redirect('/user/tryagain');
    });
});

app.get('/gallery', function(req, res){
  db
  .any("SELECT * FROM photos")
    .then(function(data){
        let photos_data = {
          photos: data
          }
      res.render('gallery/index', photos_data);
    });
});

//render goal page
app.get('/gallery/goal', function(req, res){
  res.render('gallery/goal');
});

app.get('/gallery/upload', function(req, res){
    res.render('gallery/upload');
});
//multer
app.get('/gallery/upload', function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post('/gallery/upload',function(req,res){
    upload(req,res,function(err) {
      let data=req.files;
      db.none(
        "INSERT INTO photos (filename, mimetype, path) VALUES ($1, $2, $3)",
        [data[0].filename, data[0].mimetype, data[0].path]
      )
      .then(function(){
      res.redirect("/gallery/upload");
      })
      .catch(function(){
        return res.end("Error uploading file.");
      });
          // console.log(req.body);
          console.log(req.files);
    });
});

app.get('/gallery/:id', function(req, res){
  let id = req.params.id;
  db.one("SELECT * FROM photos WHERE id = $1", id)
    .then(function(data){
      let photos_data = {
        photos: data
      }
       res.render("gallery/show", photos_data);
     })
   });


app.get('/tryagain', function(req, res){
  res.render('user/tryagain');
});


app.post('/login', function(req, res){
  let data = req.body;
  let auth_error = "Authorization Failed: Invalid email/password";
  db
    .one("SELECT * FROM users WHERE email = $1", [data.email])
    .catch(function(){
      res.redirect("/tryagain");
    })
    .then(function(user){
      bcrypt.compare(data.password, user.password, function(err, cmp){
        if(cmp){
          req.session.user = user;
          res.redirect("gallery");
        } else {
          res.redirect("/tryagain");
        }
      });
    });
});

app.get('/signup', function(req, res){
  res.render('signup/index');
});

app.get('/signup/tryagain', function(req, res){
  res.render('signup/tryagain');
});

app.post('/signup', function(req, res){
  let data = req.body;
  bcrypt
    .hash(data.password, 10, function(err, hash){
      db.none(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [data.email, hash]
      ).catch(function(e){
        res.redirect('/signup/tryagain');
      }).then(function(){
        console.log(data.email + hash + " User created! ");
        res.redirect('user/success');
      });
    });
});

app.get('/user/show', function(req, res){
  db
  .any("SELECT * FROM users")
  .then(function(data){
    let user_data = {
      users: data
    }
    res.render('user/show', user_data);
  })
});


app.get('/user/show/:id', function(req,res){
  let id = req.params.id;
  db
  .one("SELECT * FROM users WHERE id = $1", [id])
  .then(function(data){
    let user_data = {
      users: data
    }
    res.render("/user/show/", user_data);
  });
});

app.get('/delete/:id', function (req, res){
  let id = req.params.id;
  db
  .none("DELETE FROM users WHERE id = $1", [id])
  .then(function(){
  res.redirect("/user/success");
  })
  .catch(function(){
    res.redirect('/user/tryagain');
  });
});

app.get('/gallery/delete/:id', function (req, res){
  let id = req.params.id;
  db
  .none("DELETE FROM photos WHERE id = $1", [id])
  .then(function(){
  res.redirect("/gallery");
  })
  .catch(function(){
    res.redirect('/user/tryagain');
  });
});

app.get('/logout', function(req, res){
  req.session.user = false;
  res.redirect("/");
});


