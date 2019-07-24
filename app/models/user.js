const {
  sequelize
} = require('../../core/db');
const {
  Sequelize,
  Model
} = require('sequelize');

class User extends Model {

}

User.init({
  id: {
    type: Sequelize.INTEGER,
    // 主键：唯一, 不能为空，自动增长的id编号
    // id编号系统：数字，不建议用随机字符串GUID，需要考虑并发注册
    // api 接口保护
    primaryKey: true,
    autoIncrement: true,
  },
  nickname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: Sequelize.STRING,
  openid: {
    type: Sequelize.STRING(64),
    unique: true,
  }
}, {
  sequelize,
  tableName: 'user',
});
