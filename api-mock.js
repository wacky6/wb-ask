'use strict'

const {createServer} = require('http')
const app = require('koa')()
const Router = require('koa-router')
const koaBody = require('koa-body')

app.use( koaBody({ multipart: true }) )

const Users = new Router()
const Login = new Router()
const Question = new Router()
const Test = new Router()

const DATA_USER = {
    nickname: 'nickname /昵称',
    email: 'someone@example.com',    // 登录凭证
    name:  '身份证姓名',
    gender: 'M',    // 'M' -> male, 'F' -> female
    birthday: '2000-01-01',    // ISO Date String
    wealth: 100,       // Wealth
    goodanswer: 10     // number of Good answer
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
        // failure: z
        this.status = 400
        this.body = { error: '注册失败的原因（eg：昵称已存在，用户已注册）' }
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

Question.post(  '/question', function*() {
    // 创建问题
    /*
     * Request: {
     *     jwt:    'login-token',
     *     question: {    // 问题信息
     *         title:   '标题'
     *         content: '问题正文；目前来说，直接存数据库'
     *         tags:    ['标签1', '标签2']    // 如果问题没有标签，为空数组: []
     *         bounty:  100,      //悬赏数
     *     }
     * }
     */
})

Question.get(  '/question/:qid', function*() {
    // 获取问题，问题浏览次数+1
    if (this.params.qid !== 404) {
        this.status = 200
        this.body = {
            title: '问题标题',
            content: '* 如何调戏星星\n* 如何勾搭星星',
            tags: ['标签1', '标签2'],
            numAnswer: 10,  // 回答数
            numVisit: 1000, // 访问次数
            closed: false,  // 问题是否关闭
            bounty: 100,    // 悬赏
            created: 1483773606376,    // 问题的毫秒时间戳
            user: {    // 问题发布者的信息
                nickname: '昵称',
                email:    'someone@example.com',
                avatar:   'avatar'
            }
        }
    } else {
        this.status = 404
        this.body = {}
    }
})

Question.get(  '/question/:qid/answers', function*() {
    // 获得问题qid的答案
    /*
     * Query: {
     *     page: 1,    // 分页，从1开始。如有最佳答案，需在第一页返回
     *     user: 'someone@example.com',    // 用户名（邮箱）
     * }
     *
     * Response: {
     *     list: [     // 答案数组, 没有回答为空数组 []
     *         {
     *             aid: 'answer-id',      // 回答的ID
     *             content: '回答',
     *             created: 1483773606376,  // 回答的毫秒时间戳
     *             best: false,    //是否为最佳回答
     *             upvote: 10,    // 点赞数
     *             downvote: 1,   // 差评数
     *             voted: false,  // 用户user 是否已经对这个回答给出评分
     *             user: {    // 回答者的信息
     *                 nickname: '回答者昵称',
     *                 email:  'someone@example.com',
     *                 avatar: 'avatar"
     *             }
     *         }
     *     ]
     * }
     */
     this.status = 200
     this.body = {
         list: [
             { content: '回答1', created: 1483773606376, best: true,
               user: { nickname: '教授', email: 'professor@example.com', avatar: 'avatar' }
             },
             { content: '回答2', created: 1483774000000, best: false,
               user: { nickname: '小学生', email: 'student@example.com', avatar: 'avatar' }
             }
         ]
     }
})

// 测试用接口
Test.post(  '/okCharge', function*() {
    // 一键充值
    /*
     * Request: {
     *     jwt:   'login-token',  // 登录token
     *     amount: 100,    // 数量
     * }
     */
    this.status = 200
    this.body = {
        wealth: 200    // 充值完成后的财富点数
    }
})

app.use( Users.routes() )
app.use( Login.routes() )
app.use( Test.routes() )
app.use( Question.routes() )

module.exports = app.listen(8002, function(err) {
    if (err) {
        console.log(err)
        process.exit(1)
    }
})
