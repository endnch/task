const { raw } = require('objection');
const cron = require('node-cron');
const Comment = require('./models/Comment');

const badWords = ['foo', 'bar', 'baz'];

const task = cron.schedule(
  '* * * * *',
  async () => {
    const query = Comment.query().delete();

    for (const word of badWords) {
      query.orWhere(raw('lower(body)'), 'like', `%${word}%`);
    }

    const numDeleted = await query;

    console.log(numDeleted, 'comments were deleted.');
  },
  {
    scheduled: false,
  }
);

module.exports = task;
