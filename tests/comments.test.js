const supertest = require('supertest');
const { app, knex } = require('../src/app');
const api = supertest(app);

describe('/api/v1/comments', () => {
  test('returns json', async () => {
    await api
      .get('/api/v1/comments')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('comments have an id, a postId, and a body', async () => {
    const { body } = await api.get('/api/v1/comments');

    expect(body).toHaveProperty('results');
    expect(body).toHaveProperty('total');

    for (const comment of body.results) {
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('postId');
      expect(comment).toHaveProperty('body');
    }
  });

  test('create comment', async () => {
    const { body: user } = await api
      .post('/api/v1/users')
      .send({ firstName: 'Enzo', lastName: 'Nadales' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { body: post } = await api
      .post(`/api/v1/posts?userId=${user.id}`)
      .send({ body: 'The body', about: 'The about' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { body: comment } = await api
      .post(`/api/v1/comments?postId=${post.id}`)
      .send({ body: 'The body' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(comment).toHaveProperty('id');
    expect(comment).toHaveProperty('postId');
    expect(comment.postId).toEqual(post.id);
    expect(comment).toHaveProperty('body');
  });
});
