const {
  sequelize
} = require('../../core/db');
const {
  Sequelize,
  Model
} = require('sequelize');

const {
  AuthFailedException,
  NotFoundException,
} = require('../../core/http-exception');

const bcrypt = require('bcryptjs');

class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email
      }
    })

    if (!user) {
      throw new NotFoundException('账号不存在');
    }

    const correct = bcrypt.compareSync(plainPassword, user.password);

    if (!correct) {
      throw new AuthFailedException('密码不正确');
    }
  }
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
  password: {
    type: Sequelize.STRING,
    set(val) {
      const salt = bcrypt.genSaltSync(10);
      const pwd = bcrypt.hashSync(val, salt);
      this.setDataValue('password', pwd);
    }
  },
  openid: {
    type: Sequelize.STRING(64),
    unique: true,
  }
}, {
  sequelize,
  tableName: 'user',
});

module.exports = { User };
