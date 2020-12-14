const low = require('lowdb')
const lorem = require('lorem-ipsum')
const FileSync = require('lowdb/adapters/FileSync')
const { users } = require("./defaultUsers.js")
const dummydata = require("./restaurants.json")
const randomItem = require('random-item');
const uuid = require("uuid")

let reviews = []
const restaurants = dummydata.restaurants.map(r => {
  const rid = uuid.v4()
  r.reviews.forEach(review => {
    reviews.push({
      id: uuid.v4(),
      user: randomItem(users.filter(u => u.role == "user").map(u => u.username)),
      rating: review.rating,
      text: review.comments,
      dateOfVisit: "2020-12-04",
      restaurant: rid
    })
  })
  return {
    id: rid,
    name: r.name,
    owner: randomItem(users.filter(u => u.role == "owner").map(u => u.username)),
    description: lorem.loremIpsum(),
    img: r.photograph
  }
})
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ users, restaurants, reviews })
  .write()

exports.db = db