const express = require("express");
const app = express();
const port = 3200;
var cors = require('cors')
app.use(cors())

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const { users, restaurants, reviews } = require("./data.js")

const adapter = new FileSync('data.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ users, restaurants, reviews })
  .write()

app.get("/users", async (req, res) => {
  const users = db.get('users').value()
  console.log("🚀 ~ users", users)
  res.send(users);
});

app.get("/restaurants", async (req, res) => {
  const restaurants = db.get('restaurants').value()
  res.send(restaurants);
});

app.get("/reviews", async (req, res) => {
  const reviews = db.get('restaurants').value()
  res.send(reviews);
});

app.post("/login", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  const user = db.get('users').find({ username }).value()
  if(!user){
    res.status(401).send({success: false, message:"username not found"})
    return
  }
  if (user.passwordHash == password) {
    res.send({ success: true });

  } else {
    res.status(401).send({ success: false });
  }
});

app.post("/register", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  const userExists = db.get('users').find({ username }).value()
  if(userExists){
    res.status(409).send({success: false, message:"username already in use"})
  } else {
    db.get('users')
    .push({ username, passwordHash: password })
    .write()
    res.send({ success: true });
  }
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));