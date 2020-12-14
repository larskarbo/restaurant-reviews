const express = require("express");
const app = express();
const port = 3200;
var cors = require('cors')
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
const cookieParser = require('cookie-parser')
app.use(cookieParser())

require("dotenv").config()
const { verify } = require('./verify')
const uuid = require("uuid")
const { db } = require("./database")


app.get("/testauth", verify, async (req, res) => {
  res.send({ success: true });
});

app.get("/users", verify, async (req, res) => {
  const users = db.get('users').value()
  console.log("🚀 ~ users", users)
  res.send(users);
});

app.get("/restaurants", verify, async (req, res) => {
  const restaurants = db.get('restaurants').value()
  const reviews = db.get('reviews').value()
  const withCount = restaurants.map(restaurant => {
    const reviewsThis = reviews.filter((review) => review.restaurant == restaurant.id)
    const numReviews = reviewsThis.length
    return {
      ...restaurant,
      numReviews,
      avgRating: avgRating(reviewsThis),
    }
  })
  res.send(withCount);
});

const avgRating = (reviews) => {
  if (reviews.length == 0) {
    return 0
  } else {
    return Math.round((reviews.reduce((total, review) => total + (review.rating) * 1, 0) / reviews.length) * 100) / 100
  }

}

app.get("/restaurants/:restaurantId", verify, async (req, res) => {
  const restaurantId = req.params.restaurantId
  const restaurant = db.get('restaurants').find({ id: restaurantId }).value()
  console.log("🚀 ~ restaurant", restaurant)
  if (!restaurant) {
    return res.status(404).send({ message: "Not found" })
  }
  console.log("🚀 ~ restaurantId", restaurantId)
  const reviews = db.get('reviews').filter({ restaurant: restaurantId }).value()
  const numReviews = reviews.length
  res.send({
    ...restaurant,
    reviews,
    numReviews,
    avgRating: avgRating(reviews)
  });
});

app.get("/reviews", verify, async (req, res) => {
  const reviews = db.get('restaurants').value()
  res.send(reviews);
});

app.post("/reviews/add", verify, async (req, res) => {
  var rating = req.body.rating;
  console.log(req.user)
  var text = req.body.text;
  var restaurant = req.body.restaurant;
  var dateOfVisit = req.body.dateOfVisit;
  db.get('reviews')
    .push({ rating, text, user: req.user.username, restaurant, dateOfVisit, id: uuid.v4() })
    .write()
  res.send({ success: true });
});

app.post("/login", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  const user = db.get('users').find({ username })
  const userValue = user.value()
  if (!userValue) {
    res.status(401).send({ success: false, message: "username not found" })
    return
  }
  const result = await new Promise(resolve => {
    bcrypt.compare(password, userValue.passwordHash, function (err, result) {
      resolve(result)
    });
  })
  if (!result) {
    res.status(401).send({ success: false });
    return
  }

  //use the payload to store information about the user such as username, user role, etc.
  let payload = { username: username }

  //create the access token with the shorter lifespan
  console.log("🚀 ~ payload", payload)
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_LIFE
  })

  //send the access token to the client inside a cookie
  res.cookie("jwt", accessToken, { secure: false, httpOnly: true })
  res.send({
    username,
    role: userValue.role
  })
});

app.get("/logout", async (req, res) => {
  //send the access token to the client inside a cookie
  res.cookie("jwt", "", { secure: false, httpOnly: true })
  res.send({ logged: "out" })
});

// app.post('/refresh',require("./refresh").refresh)

app.post("/register", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  const userExists = db.get('users').find({ username }).value()
  if (userExists) {
    res.status(409).send({ success: false, message: "username already in use" })
  } else {
    const passwordHash = await new Promise((resolve) => {
      bcrypt.hash(password, 10, function (err, hash) {
        // Store hash in your password DB.
        resolve(hash)
      });
    })
    const userValue = {
      username,
      passwordHash,
      role: "user"
    }
    db.get('users')
      .push(userValue)
      .write()

    //use the payload to store information about the user such as username, user role, etc.
    let payload = { username: username }

    //create the access token with the shorter lifespan
    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.ACCESS_TOKEN_LIFE
    })

    //send the access token to the client inside a cookie
    res.cookie("jwt", accessToken, { secure: false, httpOnly: true })
    res.send({
      username,
      role: userValue.role
    })
  }
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));