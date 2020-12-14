const test = require('ava')
const request = require('supertest');
const app = require('../app.js');

test('login without credentials', async t => {
  const response = await request(app)
    .post('/login')
  t.is(response.status, 401);
  t.is(response.body.message, "username not found");
})

test('login wrong credentials', async t => {
  const response = await request(app)
    .post('/login')
    .send({ username: "larskarbo", password: "wrong-password" })
  t.is(response.status, 401);
  t.is(response.body.message, "wrong password");
})

test('login right credentials', async t => {
  const response = await request(app)
    .post('/login')
    .send({ username: "larskarbo", password: "wrong-password" })
  t.is(response.status, 401);
  t.is(response.body.message, "wrong password");
})

test('Dont send username', async t => {
  const password = 'some-hase'
  const response = await request(app)
    .post('/register')
    .send({password});

    t.is(response.status, 400);
    t.is(response.body.message, `username is missing`);
})

test('Dont send password', async t => {
  const username = 'some-hase'
  const response = await request(app)
    .post('/register')
    .send({username});


    t.is(response.status, 400);
    t.is(response.body.message, `password is missing`);
})