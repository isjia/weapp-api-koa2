module.exports = {
  env: 'dev',
  database: {
    dbName: 'imooc-weapp-koa-api',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'umts2011',
  },
  security: {
    secretKey: "abcdefg",
    expiresIn: 60 * 60,
  },
  wx: {
    appId: 'wx406d2d0bcb2f6c89',
    appSecret: '0983ef37bfa3c6eb44c573cfc9d317dd',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',
  }
}
