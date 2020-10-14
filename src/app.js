const express = require('express');
const Knex = require('knex');
const { Model } = require('objection');

const task = require('./cron');
const knexConfig = require('../knexfile');

const knex = Knex(knexConfig.development);
// const port = 3000;
const app = express();

Model.knex(knex);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/posts', require('./routes/posts'));
app.use('/api/v1/comments', require('./routes/comments'));

// app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}`);
// });

task.start();

module.exports = {
  app,
  knex,
};
