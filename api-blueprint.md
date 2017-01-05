FORMAT: 1A

# WB-ASK API Specification

# User Related

## User [/user/{uid}]
A registered user.

+ Parameters
    + uid: `1` (number) - User Identifier

+ Model (application/json)
    {
        "id": 1,
        "nickname": "Nickname / 昵称",
        "email": "someone@example.com",
        "name": "身份证姓名",
        "gender": "M",
        "birthday": "2000-01-01",
        "password": "Salted PBKDF Hash",
        "salt": "PBKDF Salt"
    }

### Register User [POST]
+ Request (application/json)
    + Body
        {
            "nickname": "Nickname / 昵称",
            "email": "someone@example.com",
            "name": "身份证姓名",
            "gender": "M",
            "birthday": "2000-01-01",
            "password": "plain-text password",
        }

+ Response 201
    User created successfully

+ Response 409
    User already exists. -> Conflict nickname or email

### Retrieve User Information [GET]
+ Response 200
    + Attributes
        + fund (number) -  积分数量

    + Body
        {
            "id": 1,
            "nickname": "Nickname / 昵称",
            "email": "someone@example.com",
            "name": "身份证姓名",
            "gender": "M",
            "birthday": "2000-01-01",
            "fund": 100
        }

## Login control [/login]
### Login [POST]
Login, and get jwt authorization token

+ Request
    + Body
        {
            "user": "nickname",
            "password": "plain-text password"
        }

+ Response 200
    + Attributes
        + jwt (string) - JSON Web Token string

    + Body
        {
            "user": {
                "id": 1,
                "nickname": "Nickname / 昵称",
                "email": "someone@example.com",
                "name": "身份证姓名",
                "gender": "M",
                "birthday": "2000-01-01",
                "fund": 100
            },
            "jwt": "jwt-token"
        }

+ Response 403
    Username / Password incorrect
    + Body
        {
            "message": "Error message"
        }
