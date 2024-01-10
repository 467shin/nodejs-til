const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
// form data
app.use(bodyParser.urlencoded({ extended: true }));
// json data
app.use(bodyParser.json());

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 회원가입
app.post("/register", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
