const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { users, restaurants, reviews } = require("./exampleData.js")
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ users, restaurants, reviews })
  .write()

exports.db = db