const supertest = require('supertest');
const { app, knex } = require('../src/app');
const api = supertest(app);

describe('/api/v1/users', () => {
  test('returns json', async () => {
    await api
      .get('/api/v1/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('users have an id, a firsName and a lastName', async () => {
    const response = await api.get('/api/v1/users');

    for (const user of response.body) {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
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

    const { body: result } = await api
      .get(`/api/v1/users?id=${user.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

      expect(result).toHaveProperty('id');
      expect(result.id).toEqual(user.id);
      expect(result).toHaveProperty('firstName');
      expect(result).toHaveProperty('lastName');
  });

  test('create user', async () => {
    const { body: user } = await api
      .post('/api/v1/users')
      .send({ firstName: 'Enzo', lastName: 'Nadales' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
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

    const { body } = await api
      .delete(`/api/v1/users?id=${user.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(body).toHaveProperty('status');
    expect(body.status).toEqual(200);
  });

  test('update user', async () => {
    const { body: user } = await api
      .post('/api/v1/users')
      .send({ firstName: 'John', lastName: 'Doe' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');

    const { body: updatedUser } = await api
      .put(`/api/v1/users?id=${user.id}`)
      .send({ firstName: 'Fulanito', lastName: 'Detal' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(updatedUser).toHaveProperty('id');
    expect(updatedUser).toHaveProperty('firstName');
    expect(updatedUser).toHaveProperty('lastName');
    expect(updatedUser.id).toEqual(user.id);
    expect(updatedUser.firstName).toEqual('Fulanito');
    expect(updatedUser.lastName).toEqual('Detal');
  });
});

afterAll(() => {
  knex.destroy();
});