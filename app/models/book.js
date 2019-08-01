require('module-alias/register');

const util = require('util');
const axios = require('axios');

const {
  Sequelize,
  Model,
} = require('Sequelize');
const {
  sequelize
} = require('@core/db');

class Book extends Model {
  constructor(id) {
    super();
    this.id = id;
  }

  async detail() {
    // 从外部服务获取图书详情数据
    const url = util.format(global.config.yushu.detailUrl, this.id);
    const detail = await axios.get(url);
    return detail.data;
  }
}

Book.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  fav_nums: {
    type: Sequelize.INTEGER,
    default: 0,
  }
}, {
  sequelize,
  tableName: 'book',
})

module.exports = {
  Book,
}