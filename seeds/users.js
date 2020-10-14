exports.seed = function (knex) {
  return knex('users')
    .del()
    .then(function () {
      return knex('users').insert([
        { id: 1, firstName: 'Enzo', lastName: 'Nadales' },
        { id: 2, firstName: 'Fulanito', lastName: 'Detal' },
        { id: 3, firstName: 'John', lastName: 'Doe' },
      ]);
    });
};
