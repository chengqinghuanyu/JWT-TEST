/*
import { header } from 'header.vue';
 * @Author: 尹鹏孝
 * @Date: 2021-07-18 09:39:30
 * @LastEditTime: 2021-07-18 10:35:49
 * @LastEditors: Please set LastEditors
 * @Description: 测试jwt
 * @FilePath: /nodejs/JWT-TEST/routes/users.js
 */
const router = require('koa-router')()
router.prefix('/users')
const JSONWEBTOKEN = require('jsonwebtoken');
const {
  secret
} = require('../conf/jwt.js');
const util = require('util');
const verify = util.promisify(JSONWEBTOKEN.verify);
router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})
router.get('/userInfo', async (ctx, next) => {
  let token = ctx.header.authorization;
  try {
    const payload = await verify(token.split(" ")[1], secret);
    ctx.body = {
      error: 0,
      data: payload
    }
  } catch (err) {
    console.log(err);
    ctx.body = {
      error: -1,
      data: '失败'
    }
  }

})

router.post('/login', async (ctx, next) => {
  const {
    userName,
    password
  } = ctx.request.body;
  let userInfo = null;
  if (userName === 'zhangsan' && password === "123") {
    userInfo = {
      userId: 1,
      userName: 'zhangsan',
      nickName: '张三',
      gender: 1
    }
  }
  let token;
  if (userInfo) {
    token = JSONWEBTOKEN.sign(userInfo, secret, {
      expiresIn: '1h'
    })

  }

  if (!userInfo) {
    ctx.body = {
      error: 1,
      msg: '登陆失败'
    }
    return
  }

  ctx.body = {
    error: 0,
    msg: '登陆成功',
    data: token
  }

})

module.exports = router