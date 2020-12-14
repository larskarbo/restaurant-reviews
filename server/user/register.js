const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { db } = require("../database");

const register = async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  const userExists = db.get('users').find({ username }).value();
  if (userExists) {
    res.status(409).send({ success: false, message: "username already in use" });
  } else {
    const passwordHash = await new Promise((resolve) => {
      bcrypt.hash(password, 10, function (err, hash) {
        // Store hash in your password DB.
        resolve(hash);
      });
    });
    const userValue = {
      username,
      passwordHash,
      role: "user"
    };
    db.get('users')
      .push(userValue)
      .write();

    //use the payload to store information about the user such as username, user role, etc.
    let payload = { username: username };

    //create the access token with the shorter lifespan
    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.ACCESS_TOKEN_LIFE
    });

    //send the access token to the client inside a cookie
    res.cookie("jwt", accessToken, { secure: false, httpOnly: true });
    res.send({
      username,
      role: userValue.role
    });
  }
};
exports.register = register;
