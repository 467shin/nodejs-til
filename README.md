# 📚 Node js TIL

inflearn의 `따라하며 배우는 노드, 리액트 시리즈 - 기본 강의`를 들으며 작성하는 node.js 학습 일지입니다.<br/>
호오오오옥시나 배우면서 작성한 코드가 나중에 다른 프로젝트에서 사용될 것을 우려하여 backend 폴더를 만들고 그 안에서 작업을 하였습니다.
강의를 듣다가 발생한 오류나 문제는 **여기서 잠깐!**을 통해 해결하였습니다.

## ⚙️ 목차

1. [패키지 초기 생성](#%EF%B8%8F-패키지-초기-생성)
2. [MongoDB 연결하기](#%EF%B8%8F-mongodb-연결하기)
3. [Mongoose로 Schema 만들기](#%EF%B8%8F-mongoose로-schema-만들기)
4. [POST 메서드를 활용하여 회원가입 API 만들기](#%EF%B8%8F-post-메서드를-활용하여-회원가입-api-만들기)
5. [Nodemon 설치하기](#%EF%B8%8F-nodemon-설치하기)
6. [비밀번호 암호화하기](#%EF%B8%8F-비밀번호-암호화하기)
7. [로그인 로직 작성하기](#%EF%B8%8F-로그인-로직-작성하기)
8. [로그인 성공 처리하기](<#%EF%B8%8F-로그인-성공-처리하기-(json-web-token)>)
9. [권한 처리 하기](<#%EF%B8%8F-권한-처리-하기-(auth-middleware)>)

## ⚙️ 패키지 초기 생성

### 1. 터미널에 명령어를 입력해 패키지매니저를 초기화한다.

```
$ npm init
```

현재 단계에서는 name과 auther 정도만 유의하면 되며, 완료되면 package.json 파일이 생성된다.

### 2. express를 설치하고 공식 문서에 있는 예제 코드를 참고하여 index.js 파일을 작성한다.

```
$ npm install express --save
```

```javascript
//index.js
const app = express();
// 포트 번호를 3000에서 5000으로 바꿔주었다.
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

### 3. package.json의 scripts 부분에 명령어를 추가하고, 추가한 명령어를 실행한다.

```json
// package.json
"scripts": {
    "start": "node index.js",
    ...
  },
```

```
$ npm run start
```

**여기서 잠깐!** <br>
Mac 유저라면 이 단계에서 에러가 발생하는 경우가 있을 것이다.

```
Error: listen EADDRINUSE: address already in use :::5000
```

이는 airplay가 5000번 포트를 이미 점유하고 있기 때문에 발생하는 오류이니, airplay를 끄거나 포트 번호를 바꾸도록 하자.

## ⚙️ MongoDB 연결하기

### 1. MongoDB에 가입하고 MongoDB에서 제공하는 클러스터 생성 프로세스를 따라간다.

**무료만 골라서 잘 체리피킹하는 것이 포인트**

### 2. 잘 따라가서 클러스터 생성이 완료되면 Connect, Drivers에서 application code를 복사해둔다.

```
mongodb+srv://<id>:<password>@strawberry.ubsluwz.mongodb.net/?retryWrites=true&w=majority
```

### 3. Mongoose 설치하고 index.js에 실행하는 구문 작성하기

Mongoose는 MongoDB와 Express.js 웹 애플리케이션 프레임워크 간 연결을 생성하는 자바스크립트 객체 지향 프로그래밍 라이브러리이다.

```
$ npm install mongoose --save
```

```js
// index.js
...
const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://<MongoDB 클러스터 ID>:<MongoDB 클러스터 Password>@strawberry.ubsluwz.mongodb.net/?retryWrites=true&w=majority`)
  // 성공 하면 기뻐해라
  .then(() => console.log("MongoDB Connected!"))
  // 못 했으면 에러를 뱉어라
  .catch((err) => console.log(err));
...
```

**여기서 잠깐!** <br>
index.js에 MongoDB 클러스터 ID와 비밀번호가 작성이 된 채로 공용 repository에 push를 해버리면 보안 문제가 발생할 수 있다.<br>
그러므로 우리는 환경변수 파일을 작성하여 이를 은밀하게? 관리할 필요가 있다.

### 3-1. dotenv 설치하기

1. node.js에서 .env 파일을 통해 환경변수에 접근을 하기 위해서는 우선 dotenv라는 라이브러리를 설치해야한다.

```
$ npm i dotenv
```

2. .env 파일을 작성하여 그 안에 MongoDB의 클러스터 아이디와 비밀번호를 적어준다.

```
// .env
DB_ID=<MongoDB 클러스터 ID>
DB_PW=<MongoDB 클러스터 PW>
```

3. index.js에서 dotenv를 실행하는 구문을 작성하고 환경 변수들을 불러온다.

```js
//index.js
const dotenv = require("dotenv");
dotenv.config();

// .env에 있는 두 가지를 불러온다.
const { DB_ID, DB_PW } = process.env;

const mongoose = require("mongoose");
mongoose
  .connect(
    // url에 아이디와 비밀번호를 바인딩 해준다.
    `mongodb+srv://${DB_ID}:${DB_PW}@strawberry.ubsluwz.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));
```

4. 마지막으로 .gitignore 파일을 작성해 .env 파일이 git repository에 올라가지 않도록 한다. (이게 제일 중요)
   덤으로 패키지 파일들도 올라가지 않도록 작성해준다.

```
// .gitignore
.env
node_modules
```

## ⚙️ Mongoose로 Schema 만들기

Mongoose를 활용하여 Spring의 JPA, Django의 Models처럼 schema를 만들 수 있다.

### 1. 프로젝트 폴더 밑에 models 폴더를 생성한다.

### 2. user Schema를 정의하기 위해 models 폴더 밑에 User.js 파일을 생성하고 mongoose를 정의한다.

```js
// User.js
const mongoose = require("mongoose");
```

### 3. userSchema를 정의하고 옵션을 Object 형식으로 입력한다.

```js
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
  },
  ...
});
```

### 4. Schema를 Model로 감싼 뒤 여러 곳에서도 사용할 수 있도록 export 한다.

```js
const userSchema = mongoose.Schema({
  ...
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
```

## ⚙️ POST 메서드를 활용하여 회원가입 API 만들기

### 1. body parser를 설치한다.

body parser는 client side에서 보내주는 data를 parsing 해주는 역할을 하는 라이브러리이다.

```
$ npm i body-parser --save
```

### 2. index.js에 선언한다.

```JS
// index.js
const bodyParser = require("body-parser");
// form data
app.use(bodyParser.urlencoded({ extended: true }));
// json
app.use(bodyParser.json());
```

### 3. 만들어둔 User model 불러오기

```js
const { User } = require("./models/User");
```

### 4. API POST 로직 작성하기

**여기서 잠깐!**<br>
mongoose의 최신버전에서는 콜백함수를 더 이상 지원하지 않기 때문에 강의대로 진행하면 서버가 다운되고 에러문에 뒤덮이게 될 것입니다.

```js
app.post("/api/users/register", async (req, res) => {
  // sign up 시 받아 온 정보를
  // DB에 추가
  const user = new User(req.body);

  await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});
```

**여기서 잠깐!** <br>
아까는 되던데 왜 false가 뜨고 에러문에서 이메일을 보여주지?

- email이 unique 속성이기 때문에 컬렉션에 이미 등록되어 있는 이메일로 재시도할 경우 에러(code: 11000)를 반환하게 됩니다.
- Browse Collections 버튼을 눌러 확인하세요!

## ⚙️ Nodemon 설치하기

지금까지 강의를 들으며, 코드의 변경사항을 반영하기 위해서는 server를 재기동해야 한다는 사실을 알았을 것이다.<br>
Nodemon은 코드의 저장과 동시에 변경사항을 반영시켜주는 패키지이다.<br>
개발 단계에서만 활용되는 라이브러리이기 때문에 -dev를 붙여 설치해준다

```
$ npm i nodemon --save-dev
```

nodemon을 활용하여 서버를 기동하기 위해 package.json에 스크립트 명령어를 추가해준다.

```
// package.json
"scripts": {
    ...
    "backend": "nodemon index.js",
    ...
  },
```

```
$ npm run backend
```

## ⚙️ 비밀번호 암호화하기

비밀번호는 민감한 정보이기 때문에 db에 그대로 저장을 하게 되면 안 된다.<br>
그러므로 해싱을 통해 비밀번호를 암호화한 뒤 저장하는 것을 추천한다.

### 1. bcrypt 설치하기

```
$ npm i bcrypt --save
```

### 2. bcrypt 적용하기

또한 암호화는 data를 db에 저장하기 직전에 이루어져야 한다.<br>
그러므로 models의 User.js에 bcrypt를 적용해야 한다.

```js
const bcrypt = require("bcrypt");
// 소금 10번 치기
const saltRounds = 10;
```

**여기서 잠깐!**<br>
비밀번호를 암호화하는 과정에서 비밀번호 뒤에 일련의 문자열을 붙인 다음 해싱을 하게 되면 Rainbow Table을 활용한 브루트포스 공격의 난이도가 더욱 높아지는데,
이 때 뒤에 붙는 일련의 문자열을 `소금`이라 한다.

### 3. 암호화 로직 작성하기

```js
// User.js

// save 전에 실행
userSchema.pre("save", function (next) {
  let user = this;

  // 암호화 로직
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);
```

**여기서 잠깐!**<br>
맨 윗줄의 함수만 화살표 함수가 아닌 이유는 `this` 키워드 때문이다.<br>
일반 함수일 경우, user 변수의 this가 `userSchema`를 가리키지만, 화살표 함수의 경우 한 단계 밖인 전역을 가리키기 때문에...

```js
// 암호화 로직
if (user.isModified("password")) {
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(user.password, salt))
    .then((hash) => {
      user.password = hash;
      next();
    })
    .finally((err) => next(err));
} else {
  next();
}
```

콜백함수를 사용하기 싫어서 promise 문법으로 바꾸어 보았다.

### 4. Postman으로 확인하기

그리고 잘 돼서 기뻐하기

## ⚙️ 로그인 로직 작성하기

### 1. post요청을 받는 login API 및 sudo code 생성

```js
// index.js
app.post("/api/users/login", async (req, res) => {
  // 받은 이메일을 DB에서 찾는다.
  // 해당 email로 된 유저가 있을 경우
  // 없을 경우
  // 비밀번호 체크
  // 유효하면 토큰 생성
});
```

### 2. 이메일 대조 로직 작성

API 함수 내부에 mongoose의 findOne 메서드를 활용하여 클라이언트로부터 받아온 email을 비교하는 로직을 작성한다.<br>
**여기서 잠깐!**
findOne 메서드에서 콜백함수를 더 이상 지원하지 않는다는 에러문을 받았다.<br>
그러니 앞으로 강의 내의 모든 코드를 promise 문법으로 고친 뒤 업로드 할 것이다.

```js
// index.js
// app.post("/api/users/login" ...
User.findOne({ email: req.body.email })
  .then((user) => {
    // 해당 email로 된 유저가 있을 경우
    // 비밀번호 체크
  })
  // 없을 경우
  .catch((err) => {
    res.json({
      loginSuccess: false,
      message: "유저가 없습니다.",
    });
  });
```

### 3. model에 비밀번호 대조 메서드 작성

email의 체크가 완료되었다면, 클라이언트가 입력한 password의 유효성을 체크해야한다.<br>
하지만 DB에 저장되어있는 password는 소금을 뿌린 해시브라운이기 때문에 bcrypt의 compare 메서드를 활용해야 한다.<br>
그러기 위해서는 bcrypt가 적용되어있는 models의 User.js에 password의 유효성을 검사하는 메서드를 작성하는 것이 좋다.

```js
// User.js
userSchema.methods.passwordCheck = function (plainPassword) {
  // plainPassword && hashedPasword
  return bcrypt.compare(plainPassword, this.password);
};
```

클라이언트로부터 받은 password와 DB내의 password를 서로 비교해서 t/f로 반환하는 `passwordCheck` 메서드를 만들었다!

### 4. API에 비밀번호 대조 로직 작성

비밀번호를 대조하는 메서드의 작성이 완료되었으니 이를 활용하여 비밀번호가 맞지 않는 경우를 걸러주자.

```js
// index.js
// app.post("/api/users/login" ...
// User.findOne({ email: req.body.email }).then((user) => {...
// 해당 email로 된 유저가 있을 경우
// 비밀번호 체크
user
  .passwordCheck(req.body.password)
  .then((isMatch) => {
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호 에러",
      });
    }
    // 유효하면 토큰 생성
  })
  .catch((err) => {
    //...
  });
```

**여기서 잠깐!**<br>
로그인 로직의 에러 메시지를 너무 자세하게 작성하게 되면 보안상의 문제가 발생하게 될 수 있으나, 개발 단계의 편의성을 위해 일단...

## ⚙️ 로그인 성공 처리하기 (JSON Web Token)

### 1. JWT 인스톨

로그인을 처리하는 방법 중 가장 보편적으로 사용되는 방법이 바로 JSON Web Token(JWT)이다.<br>
JWT를 생성하기 위해서는 우선 JSONWEBTOKEN이라는 라이브러리를 설치해야 한다.

```
$ npm i jsonwebtoken --save
```

### 2. model에 토큰 발급 메서드 작성

라이브러리가 설치가 완료되면 user 정보에 접근하고, user 테이블에 token을 저장해야 하기 때문에 models의 User.js에 토큰을 발급하고 저장하는 메서드를 작성해야한다.

```js
//User.js
const jwt = require("jsonwebtoken");

...

userSchema.methods.generateToken = function () {
  let user = this;

  // token 생성
  const token = jwt.sign(user._id.toJSON(), "secret");

  user.token = token;
  return user.save();
};
```

**여기서 잠깐!**<br>
mongoose의 .save() 메서드가 콜백 함수를 지원하지 않도록 바뀌면서 변경된 user 테이블 그 자체를 반환하도록 바뀐 것으로 추정되기에 바로 save()를 반환해 주었다.

### 3. 발급된 토큰을 cookie에 저장

Express에서 cookie에 접근하기 위해서는 cookie-parser라는 라이브러리를 설치해야 한다.

```
$ npm i cookie-parser --save
```

설치가 완료 되었다면, index.js에 cookie-parser를 정의해주고, 토큰을 쿠키에 저장하자.

```js
// index.js
const cookieParser = require("cookie-parser");
app.use(cookieParser());

...

// login logic 내부

// 유효하면 토큰 생성
user
  .generateToken()
  .then((userInfo) => {
    // 쿠키에 토큰 저장
    res.cookie("x_auth", userInfo.token).status(200).json({ loginSuccess: true, userId: userInfo._id });
  })
  .catch((err) => res.status(400).send(err));
```

## ⚙️ 권한 처리 하기 (Auth Middleware)

로그인을 완료하면 인코딩된 token이 발급된다.<br>
이 token을 활용하여 권한 처리를 하게 된다.<br>
권한이 필요한 동작을 하기 위해서는 쿠키 내부의 인코딩된 token과 DB의 token을 상호비교하여 유효성을 체크 해야한다.<br>
그것을 해주는 것이 바로 미들웨어.

### 1. 미들웨어 생성하기

프로젝트 root directory에 middleware라는 폴더를 만들고, auth.js 파일을 만든다.

```js
// auth.js
let auth = (req, res, next) => {
  // 인증 처리 로직
  // 쿠키에서 토큰 가져오기
  // 토큰 디코딩하고 유저 찾기
  // 유저가 없으면 인증 실패
  // 유저가 있으면 인증 완료
};

module.exports = { auth };
```

### 2. 권한 처리 로직 작성하기

#### 2-1. 토큰과 id값으로 유저 찾는 메서드 작성하기

토큰으로 유저를 찾기 위해서는 DB에 접근해야 하기 때문에 user 모델 내부에 token을 매개변수로 받는 메서드를 작성하는 것이 좋다.<br>
또한 토큰의 검증은 .verify()메서드를 활용하면 가능하다.<br>
verify 메서드는 아직도 콜백 함수를 인자로 받으며, 콜백함수를 작성하지 않으면 서버 크래시가 나버리기 때문에 npm의 jsonwebtoken 공식문서를 참고하여 try/catch문으로 작성하였다.

```js
// User.js
userSchema.statics.findByToken = async function (token) {
  let user = this;

  // 토큰 디코딩
  try {
    const decoded = await jwt.verify(token, "secret");
    // token을 디코딩하여 얻은 id와
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인하여 반환
    return user.findOne({ _id: decoded, token: token });
  } catch (err) {
    // 토큰에러
    console.log("err:", err);
  }
};
```

#### 2-2. 작성한 메서드를 활용해서 검증하기

```js
// auth.js
const { User } = require("../models/User");

let auth = async (req, res, next) => {
  // 쿠키에서 토큰 가져오기
  let token = req.cookies.x_auth;

  // 토큰 디코딩하고 유저 찾기
  User.findByToken(token)
    .then((user) => {
      // 유저가 없으면 인증 실패
      if (!user) return res.json({ isAuth: false });

      // 유저가 있으면 인증 완료
      req.token = token;
      req.user = user;
      next();
    })
    .catch((err) => {
      throw err;
    });
};
```

### 3. 권한 처리 API 작성하기

권한 처리 API를 작성할 때 엔드포인트와 콜백함수 사이에 auth 미들웨어를 매개변수로 넣어주면 미들웨어가 먼저 실행된 다음 콜백함수로 넘어가게 된다.<br>

```js
// index.js
const { auth } = require("./middleware/auth");

...

app.get("/api/users/auth", auth, async (req, res) => {
  // 여기에 도달했다면 auth 로직을 통과했다는 의미
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? true : false,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
  });
});
```
