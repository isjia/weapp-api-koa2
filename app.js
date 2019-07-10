const Koa = require('koa');

const app = new Koa(); // 应用程序对象

function test() {
  console.log('hello app, test 1');
}

// 注册到中间件
app.use(async(ctx, next)=>{
  test();
  const a = await next();
  console.log('test 3');
  console.log(a);
});

app.use(async(ctx, next)=>{
  console.log('test2');
  await next();
  console.log('test 4');
  return 'test 5'
})

app.listen(3000);
