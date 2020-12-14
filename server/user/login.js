const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { db } = require("../database");

const login = async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  const user = db.get('users').find({ username });
  const userValue = user.value();
  if (!userValue) {
    res.status(401).send({ success: false, message: "username not found" });
    return;
  }
  const result = await new Promise(resolve => {
    bcrypt.compare(password, userValue.passwordHash, function (err, result) {
      resolve(result);
    });
  });
  if (!result) {
    res.status(401).send({ success: false, message: "wrong password" });
    return;
  }

  //use the payload to store information about the user such as username, user role, etc.
  let payload = { username: username };

  //create the access token with the shorter lifespan
  console.log("🚀 ~ payload", payload);
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "no secret", {
    algorithm: "HS256",
    expiresIn: "30d"
  });

  //send the access token to the client inside a cookie
  res.cookie("jwt", accessToken, { secure: false, httpOnly: true });
  res.send({
    username,
    role: userValue.role
  });
};
exports.login = login;
