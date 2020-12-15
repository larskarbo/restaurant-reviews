const { db } = require("../database");

const getAllUsers = async (req, res) => {
  if(req.user.role != "admin"){
    res.status(401).send({ success: false, message: "you need to be an admin to see this page" });
    return;
  }

  const users = db.get('users').value()

  for(const user of users){
    if(user.role=="owner"){
      user.restaurants = db.get('restaurants').filter({owner:user.username}).value().length
    }
    user.reviews = db.get('reviews').filter({user:user.username}).value().length
  }

  //send the access token to the client inside a cookie
  res.send({
    users
  });
};
exports.getAllUsers = getAllUsers;
