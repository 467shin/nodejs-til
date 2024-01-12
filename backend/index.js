const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
// form data
app.use(bodyParser.urlencoded({ extended: true }));
// json data
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// 환경 변수 접근을 허용해주는 라이브러리
const dotenv = require("dotenv");
dotenv.config();

const { DB_ID, DB_PASSWORD, DB_URI } = process.env;

const mongoose = require("mongoose");
mongoose
  .connect(`mongodb+srv://${DB_ID}:${DB_PASSWORD + DB_URI}`)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));

const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

app.get("/", (req, res) => {
  res.send("돌고도는 지구의를 길잡이 삼아");
});

// signUp
app.post("/api/users/register", async (req, res) => {
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

// login
app.post("/api/users/login", async (req, res) => {
  // 요청된 이메일을 데이터베이스에서 찾는다.
  User.findOne({ email: req.body.email })
    .then((user) => {
      // 해당 email로 된 유저가 있을 경우
      // 비밀번호 체크
      user.passwordCheck(req.body.password).then((isMatch) => {
        if (!isMatch) {
          return res.json({
            loginSuccess: false,
            message: "비밀번호 에러",
          });
        }
        // 유효하면 토큰 생성
        user
          .generateToken()
          .then((userInfo) => {
            // 쿠키에 토큰 저장
            res.cookie("x_auth", userInfo.token).status(200).json({ loginSuccess: true, userId: userInfo._id });
          })
          .catch((err) => res.status(400).send(err));
      });
    })
    // 유저 없음
    .catch((err) => {
      res.json({
        loginSuccess: false,
        message: "유저가 없습니다.",
      });
    });
});

// user 정보 반환
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

// logout
app.get("/api/users/logout", auth, async (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => res.json({ success: false, err }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
