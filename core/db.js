const Sequelize = require('sequelize');
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
  }
});

sequelize.sync();

module.exports = {
  sequelize
}