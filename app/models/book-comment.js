require('module-alias/register');

const {
  Sequelize,
  Model,
} = require('Sequelize');
const {
  sequelize
} = require('@core/db');

class Comment extends Model {
  static async addComment(bookId, content) {
    const comment = await Comment.findOne({
      where: {
        book_id: bookId,
        content,
      }
    })

    if (!comment) {
      return await Comment.create({
        book_id: bookId,
        content,
        nums: 1
      })
    } else {
      return await comment.increment('nums', {
        by: 1,
      })
    }
  }

  // 获取图书的所有短评 by bookId
  static async getComments(bookId) {
    const comments = await Comment.findAll({
      where: {
        book_id: bookId,
      }
    });
    return comments;
  }
}

Comment.init({
  content: Sequelize.STRING(12),
  nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  book_id: Sequelize.INTEGER,
}, {
  sequelize,
  tableName: 'comment',
})

module.exports = {
  Comment,
}