'use strict'

const {createServer} = require('http')
const app = require('koa')()
const Router = require('koa-router')
const koaBody = require('koa-body')

app.use( koaBody({ multipart: true }) )

const Users = new Router()
const Login = new Router()

const DATA_USER = {
    id: 1,
    nickname: 'nickname /昵称',
    email: 'someone@example.com',
    name:  '身份证姓名',
    gender: 'M',    // 'M' -> male, 'F' -> female
    birthday: '2000-01-01',    // ISO Date String
    fund: 100    // Available Funds
}

Users.get(   '/user/:uid', function*() {
    // return user information
    if (this.params.uid !== 0) {
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
     *     id,
     *     nickname,
     *     email,
     *     name,
     *     gender,
     *     birthday,
     *     password
     * }
     */
    if (this.request.body.nickname !== 'error') {
        // success
        this.status = 201
        this.body = {}
    } else {
        // failure: user already exists
        this.status = 409
        this.body = {}
    }
})

Login.post(  '/login', function*() {
    // Login
    /*
     * Request: JSON {
     *    user: nickname / email
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

app.use( Users.routes() )
app.use( Login.routes() )

module.exports = app.listen(8002, function(err) {
    if (err) {
        console.log(err)
        process.exit(1)
    }
})
