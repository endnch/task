const supertest = require('supertest');
const { app, knex } = require('../src/app');
const api = supertest(app);

describe('/api/v1/posts', () => {
  test('returns json', async () => {
    await api
      .get('/api/v1/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('posts have an id, a userId, a body, and an about', async () => {
    const response = await api.get('/api/v1/posts');

    for (const post of response.body) {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('userId');
      expect(post).toHaveProperty('body');
      expect(post).toHaveProperty('about');
    }
  });

  test('search by id', async () => {
    const { body: user } = await api
      .post('/api/v1/users')
      .send({ firstName: 'Enzo', lastName: 'Nadales' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');

    const { body: post } = await api
      .post(`/api/v1/posts?userId=${user.id}`)
      .send({ body: 'The body', about: 'The about' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const { body: result } = await api
      .get(`/api/v1/posts?id=${post.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result).toHaveProperty('id');
    expect(result.id).toEqual(post.id);
    expect(result).toHaveProperty('userId');
    expect(result.userId).toEqual(user.id);
    expect(result).toHaveProperty('body');
    expect(result).toHaveProperty('about');
  });

  test('create post', async () => {
    const { body: user } = await api
      .post('/api/v1/users')
      .send({ firstName: 'Enzo', lastName: 'Nadales' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');

    const { body: post } = await api
      .post(`/api/v1/posts?userId=${user.id}`)
      .send({ body: 'The body', about: 'The about' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('userId');
    expect(post.userId).toEqual(user.id);
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('about');
  });

  test('delete user', async () => {
    const { body: user } = await api
      .post('/api/v1/users')
      .send({ firstName: 'Enzo', lastName: 'Nadales' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');

    const { body: post } = await api
      .post(`/api/v1/posts?userId=${user.id}`)
      .send({ body: 'The body', about: 'The about' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('userId');
    expect(post.userId).toEqual(user.id);
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('about');

    const { body } = await api
      .delete(`/api/v1/posts?id=${post.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(body).toHaveProperty('status');
    expect(body.status).toEqual(200);
  });

  test('update post', async () => {
    const { body: user } = await api
      .post('/api/v1/users')
      .send({ firstName: 'Enzo', lastName: 'Nadales' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');

    const { body: post } = await api
      .post(`/api/v1/posts?userId=${user.id}`)
      .send({ body: 'The body', about: 'The about' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('userId');
    expect(post.userId).toEqual(user.id);
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('about');

    const { body: updatedPost } = await api
      .put(`/api/v1/posts?id=${post.id}`)
      .send({ body: 'Updated body', about: 'Updated about' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(updatedPost).toHaveProperty('id');
    expect(updatedPost).toHaveProperty('userId');
    expect(updatedPost).toHaveProperty('body');
    expect(updatedPost).toHaveProperty('about');
    expect(updatedPost.id).toEqual(post.id);
    expect(updatedPost.body).toEqual('Updated body');
    expect(updatedPost.about).toEqual('Updated about');
  });
});

afterAll(() => {
  knex.destroy();
});