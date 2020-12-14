const { db } = require("../database");
const { avgRating } = require("./avgRating");

const getRestaurant = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const restaurant = db.get('restaurants').find({ id: restaurantId }).value();
  console.log("🚀 ~ restaurant", restaurant);
  if (!restaurant) {
    return res.status(404).send({ message: "Not found" });
  }
  console.log("🚀 ~ restaurantId", restaurantId);
  const reviews = db.get('reviews').filter({ restaurant: restaurantId }).value();
  const numReviews = reviews.length;
  res.send({
    ...restaurant,
    reviews,
    numReviews,
    avgRating: avgRating(reviews)
  });
};
exports.getRestaurant = getRestaurant;
