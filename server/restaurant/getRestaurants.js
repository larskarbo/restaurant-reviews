const { db } = require("../database");
const { avgRating } = require("./avgRating");

const getRestaurants = async (req, res) => {
  const restaurants = db.get('restaurants').value().filter(r => !r.deleted)
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
exports.getRestaurants = getRestaurants;
