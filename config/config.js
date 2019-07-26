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
  }
}