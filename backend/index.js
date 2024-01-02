const express = require("express");
const app = express();
const port = 5000;

// 환경 변수 접근을 허용해주는 라이브러리
const dotenv = require("dotenv");
dotenv.config();

const { DB_ID, DB_PASSWORD } = process.env;

const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://${DB_ID}:${DB_PASSWORD}@strawberry.ubsluwz.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
