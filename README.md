# Node js TIL

inflearn의 `따라하며 배우는 노드, 리액트 시리즈 - 기본 강의`를 들으며 작성하는 node.js 학습 일지입니다.<br/>
호오오오옥시나 배우면서 작성한 코드가 나중에 다른 프로젝트에서 사용될 것을 우려하여 backend 폴더를 만들고 그 안에서 작업을 하였습니다.
강의를 듣다가 발생한 오류나 문제는 **여기서 잠깐!**을 통해 해결하였습니다.

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
mongoose.connect(`mongodb+srv://<MongoDB 클러스터 ID>:<MongoDB 클러스터 Password>@strawberry.ubsluwz.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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
})

const User = mongoose.model("User", userSchema);

module.exports = { User };
```
