const express = require("express");
const app = express();
var cors = require('cors')
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())

require("dotenv").config()

// middleware imports
const { verify } = require('./verify')

// routes imports
const { addComment } = require("./review/addComment");
const { getRestaurant } = require("./restaurant/getRestaurant");
const { getMyRestaurants } = require("./restaurant/getMyRestaurants");
const { getRestaurants } = require("./restaurant/getRestaurants");
const { addReview } = require("./review/addReview");
const { editReview } = require("./review/editReview");
const { login } = require("./user/login");
const { logout } = require("./user/logout");
const { register } = require("./user/register");


app.get("/", async (req, res) => {
  res.send({ status: "Ok" });
});

app.get("/testauth", verify, async (req, res) => {
  res.send({ success: true });
});

// restaurants
app.get("/myRestaurants", verify, getMyRestaurants);
app.get("/restaurants", verify, getRestaurants);
app.post("/restaurants/:restaurantId/:reviewId/addComment", verify, addComment);
app.get("/restaurants/:restaurantId", verify, getRestaurant);

// reviews
app.post("/reviews/add", verify, addReview);
app.post("/reviews/edit", verify, editReview);

// user
app.get("/getUser", verify, async (req, res) => {
  res.send(req.user);
});
app.post("/login", login);
app.get("/logout", logout);
app.post("/register", register);


app.all("/*", (req, res) => {
  return res.status(404).send({
    status: "Not found"
  })
});


module.exports = app