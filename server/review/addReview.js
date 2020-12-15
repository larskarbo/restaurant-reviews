const uuid = require("uuid");
const { db } = require("../database");

const addReview = async (req, res) => {
  var rating = req.body.rating;
  var text = req.body.text;
  var restaurant = req.body.restaurant;
  var dateOfVisit = req.body.dateOfVisit;
  db.get('reviews')
    .push({ rating, text, user: req.user.username, restaurant, dateOfVisit, id: uuid.v4() })
    .write();
  res.send({ success: true });
};
exports.addReview = addReview;
