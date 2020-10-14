const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get modifiers() {
    return {
      searchByName(query, name) {
        query.where((query) => {
          for (const namePart of name.trim().split(/\s+/)) {
            for (const column of ['firstName', 'lastName']) {
              query.orWhereRaw('lower(??) like ?', [
                column,
                namePart.toLowerCase() + '%',
              ]);
            }
          }
        });
      },
    };
  }

  static get relationMappings() {
    const Post = require('./Post');

    return {
      posts: {
        relation: Model.HasManyRelation,
        modelClass: Post,
        join: {
          from: 'users.id',
          to: 'posts.userId',
        },
      },
    };
  }
}

module.exports = User;
