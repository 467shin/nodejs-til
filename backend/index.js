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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
