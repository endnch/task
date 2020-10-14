exports.seed = function (knex) {
  return knex('comments')
    .del()
    .then(function () {
      const entries = [];

      entries.push({ id: 1, body: 'Hello, foo!' });
      entries.push({ id: 2, body: 'Hello, Bar!' });
      entries.push({ id: 3, body: 'Hello, BAZ!' });

      for (let i = 4; i <= 100; i++) {
        entries.push({ id: i, body: `Comment #${i}` });
      }
      return knex('comments').insert(entries);
    });
};
