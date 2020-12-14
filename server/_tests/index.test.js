const test = require('ava')
const request = require('supertest');
const app = require('./../app.js');

test('check status', async t => {
  const response = await request(app)
    .get('/');
    t.is(response.status, 200);
    t.deepEqual(response.body, {
      status : 'Ok'
    });
})

test('testAuth', async t => {
  const response = await request(app)
    .get('/testAuth')

    t.is(response.status, 403);
    t.is(response.body.message, `No access token present`);
})


// test('Dont send username', async t => {
//   const password = 'some-hase'
//   const response = await request(app)
//     .post('/register')
//     .send({password});

//     t.is(response.status, 400);
//     t.is(response.body.message, `username is missing`);
// })


// test('Dont send password', async t => {
//   const username = 'some-hase'
//   const response = await request(app)
//     .post('/register')
//     .send({username});

    
//     t.is(response.status, 400);
//     t.is(response.body.message, `password is missing`);
// })