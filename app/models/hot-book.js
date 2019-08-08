require('module-alias/register');

const { Favor } = require('./favor');
const { Sequelize, Model, Op } = require('Sequelize');
const {
  sequelize
} = require('@core/db');

class HotBook extends Model {
  static async getAll() {
    const books = await HotBook.findAll({
      order: [
        'index'
      ]
    });

    const ids = [];
    // 注意这里的 forEach 只适用于同步方法，不使用与 async/await
    books.forEach((book) => {
      ids.push(book.id)
    })

    const favors = await Favor.findAll({
      where: {
        art_id: {
          [Op.in]: ids,
        },
        type: 400,
      },
      group: ['art_id'],
      attributes: ['art_id', [sequelize.fn('COUNT', 'art_id'), 'artIdCount']]
    })
    books.forEach(book => {
      HotBook._getEachBookStatus(book, favors)
    });
    return books;
  }

  static _getEachBookStatus(book, favors) {
    let count = 0;
    favors.forEach(favor => {
      if (book.id === favor.art_id) {
        count = favor.get('artIdCount')
        console.log('connt>>>>>>>> ', count)
      }
    })
    book.setDataValue('fav_nums', count);
    return book;
  }
}

HotBook.init({
  index: Sequelize.INTEGER,
  image: Sequelize.STRING,
  author: Sequelize.STRING,
  title: Sequelize.STRING,
}, {
  sequelize,
  tableName: 'hot_book',
})

module.exports = {
  HotBook,
}