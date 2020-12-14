const { db } = require("../database");

module.exports.addComment = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const reviewId = req.params.reviewId;
    const restaurant = db.get('restaurants').find({ id: restaurantId }).value();
    if (!restaurant) {
      return res.status(404).send({ message: "Not found" });
    }
    if (req.user.role == "admin" || (req.user.role == "owner" && restaurant.owner == req.user.username)) {
      // console.log("🚀 ~ restaurantId", restaurantId)
      var commentFromOwner = req.body.commentFromOwner;
      console.log("myreview", db.get('reviews')
        .filter({ restaurant: restaurantId })
        .find({ id: reviewId })
        .value());
      db.get('reviews')
        .filter({ restaurant: restaurantId })
        .find({ id: reviewId })
        .assign({ commentFromOwner: commentFromOwner })
        .write();
      res.send({ success: true });
      // const reviews = db.get('reviews').filter({ restaurant: restaurantId }).value()
      // const numReviews = reviews.length
      // res.send({
      //   ...restaurant,
      //   reviews,
      //   numReviews,
      //   avgRating: avgRating(reviews)
      // });
    } else {
      return res.status(401).send({ message: "Not allowed" });
    }
  };