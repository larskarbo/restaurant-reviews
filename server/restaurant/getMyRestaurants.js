const { db } = require("../database");
const { avgRating } = require("./avgRating");

// app.get("/users", verify, async (req, res) => {
//   const users = db.get('users').value()
//   console.log("🚀 ~ users", users)
//   res.send(users);
// });
const getMyRestaurants = async (req, res) => {
  if (req.user.role != "owner") {
    res.send([]);
  }
  const restaurants = db.get('restaurants').filter({ owner: req.user.username }).value();
  const reviews = db.get('reviews').value();
  const withCount = restaurants.map(restaurant => {
    const reviewsThis = reviews.filter((review) => review.restaurant == restaurant.id);
    const numReviews = reviewsThis.length;
    return {
      ...restaurant,
      numReviews,
      reviewsNeedingComment: reviewsThis.filter(review => !review.commentFromOwner).length,
      avgRating: avgRating(reviewsThis),
    };
  });
  res.send(withCount);
};
exports.getMyRestaurants = getMyRestaurants;
