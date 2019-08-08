const { Sequelize, Model} = require('sequelize');
const {
  unset,
  clone,
  isArray,
} = require('lodash');

const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database;

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true,
  timezone: '+08:00',
  define: {
    // 个性化配置
    timestamps: true, //createdAt, updatedAt
    paranoid: true, // 软删除
    scopes: {
      bh: {
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']},
      }
    }
  }
});

Model.prototype.toJSON = function () {
  let data = clone(this.dataValues);
  unset(data, 'updatedAt');
  unset(data, 'createdAt');
  unset(data, 'deletedAt');

  for (key in data) {
    if (key === 'image') {
      if (!data[key].startsWith('http')) {
        data[key] = global.config.host + data[key];
      }
    }
  }

  if(isArray(this.exclude)) {
    this.exclude.forEach(
      (value) => {
        unset(data, value)
      }
    )
  }

  return data;
}

sequelize.sync();

module.exports = {
  sequelize
}