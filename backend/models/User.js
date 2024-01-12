const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// 소금
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// save 전에 실행
userSchema.pre("save", function (next) {
  let user = this;

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
});

userSchema.methods.passwordCheck = function (plainPassword) {
  // plainPassword && hashedPasword
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = function () {
  let user = this;

  // token 생성
  const token = jwt.sign(user._id.toJSON(), "secret");

  user.token = token;
  return user.save();
  // .then((userInfo) => userInfo)
  // .catch((err) => err);
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
