const avgRating = (reviews) => {
  if (reviews.length == 0) {
    return 0;
  } else {
    return Math.round((reviews.reduce((total, review) => total + (review.rating) * 1, 0) / reviews.length) * 100) / 100;
  }

};
exports.avgRating = avgRating;
