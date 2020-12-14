const uuid = require("uuid");
const { db } = require("../database");

const editReview = async (req, res) => {
  var rating = req.body.rating;
  var text = req.body.text;
  var restaurant = req.body.restaurant;
  var dateOfVisit = req.body.dateOfVisit;

  const review = db.get('reviews').find({id:req.body.reviewId}).value()
  if (req.user.role == "admin" || (review.user == req.user.username)) {
    db.get('reviews')
      .push({ rating, text, user: req.user.username, restaurant, dateOfVisit, id: uuid.v4() })
      .write();
    res.send({ success: true });
  } else {
    return res.status(401).send({ message: "Not allowed" });
  }
};
exports.editReview = editReview;
