'use strict'

const {createServer} = require('http')
const app = require('koa')()
const Router = require('koa-router')
const koaBody = require('koa-body')

app.use( koaBody({ multipart: true }) )

const Users = new Router()
const Login = new Router()

const DATA_USER = {
    nickname: 'nickname /昵称',
    email: 'someone@example.com',    // 登录凭证
    name:  '身份证姓名',
    gender: 'M',    // 'M' -> male, 'F' -> female
    birthday: '2000-01-01',    // ISO Date String
    fund: 100    // Available Funds
}

Users.get(   '/user/:uid', function*() {
    // return user information
    if (this.params.uid) {
        // success
        this.status = 200
        this.body = DATA_USER
    } else {
        // failure: user does not exist
        this.status = 404
        this.body = { error: 'error message' }
    }
})

Users.post(  '/user/', function*() {
    // register new user
    /*
     * Request JSON, mostly DATA_USER: {
     *     email,
     *     nickname,
     *     name,
     *     gender,
     *     birthday,
     *     password
     * }
     */
    if (this.request.body.email !== 'error') {
        // success
        this.status = 201
        this.body = {}
    } else {
        // failure: validation error
        this.status = 400
        this.body = { error: '注册失败' }
    }
})

Login.post(  '/login', function*() {
    // Login
    /*
     * Request: JSON {
     *    user: email
     *    password: plain-text password
     * }
     */
    if (this.request.body.user !== 'error') {
        // success
        this.status = 200
        this.body = {
            user: DATA_USER,
            jwt:  'json-web-token authorization'
        }
    }else{
        // failure: incorrect user/password
        this.status = 403
        this.body = {
            error: "error message"
        }
    }
})

Users.get(   '/user', function*() {
    // 用户查询、筛选
    // 目前仅用来返回首页土豪榜
    /*
     * Query:
     *     limit: 10    (number) 返回的结果数量
     *     condition: 'top'
     */
    if (this.request.query.condition === 'top') {
        // 土豪榜
        // eg: GET    /user ? condition=top & limit=10
        this.status = 200
        this.body = {
            list: [    // limit个如下格式的用户信息
                {
                    nickname:   '用户名',
                    avatar:     '头像',
                    wealth:     100,    // 财富值
                    goodanswer: 10,     // 采纳的回答数
                    gender:     'F'     // 性别
                }
            ]
        }
    }
})

app.use( Users.routes() )
app.use( Login.routes() )

module.exports = app.listen(8002, function(err) {
    if (err) {
        console.log(err)
        process.exit(1)
    }
})
