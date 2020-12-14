const test = require('ava')
const request = require('supertest');
const app = require('../app.js');

test('404', async t => {
  const response = await request(app)
    .get('/asdfasdf');
  t.is(response.status, 404);
  console.log("🚀 ~ response.body", response.body)
  t.deepEqual(response.body, {
    status: 'Not found'
  });
})
