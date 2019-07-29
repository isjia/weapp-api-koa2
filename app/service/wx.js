const util = require('util');
const axios = require('axios');

const { AuthFailedException } = require('../../core/http-exception');
const { User } = require('../models/user');
const {
  generateToken,
} = require('../../core/util');

const { Auth } = require('../../middlewares/auth');

class WXManager {
  static async codeToToken(code) {
    // 发送code 到微信服务器，换取 token
    // 获取 openid
    // 不需要 password
    // 没有注册流程
    // appid appsecret 写入配置文件
    const url = util.format(global.config.wx.loginUrl, global.config.wx.appId, global.config.wx.appSecret, code);

    const result = await axios.get(url);

    if (result.status !== 200) {
      throw new AuthFailedException('openid获取失败');
    }

    if (result.data.errcode) {
      throw new AuthFailedException('openid获取失败：' + result.data.errmsg);
    }
    
    let user = await User.getUserByOpenid(result.data.openid)

    if (!user) {
      user = await User.registUserByOpenid(result.data.openid)
    }

    return generateToken(user.id, Auth.USER);
  }
}

module.exports = {
  WXManager,
}