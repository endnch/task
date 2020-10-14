exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();

      table.string('firstName');
      table.string('lastName');
    })
    .createTable('posts', (table) => {
      table.increments('id').primary();

      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .index();

      table.string('body');
      table.string('about');
    })
    .createTable('comments', (table) => {
      table.increments('id').primary();

      table
        .integer('postId')
        .unsigned()
        .references('id')
        .inTable('posts')
        .onDelete('SET NULL')
        .index();

      table.string('body');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('posts')
    .dropTableIfExists('comments');
};
