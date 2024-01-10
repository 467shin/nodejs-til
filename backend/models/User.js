const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// 소금
const saltRounds = 10;

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

  // if (user.isModified("password")) {
  //   bcrypt.genSalt(saltRounds, (err, salt) => {
  //     console.log(salt);
  //     if (err) return next(err);
  //     bcrypt.hash(user.password, salt, (err, hash) => {
  //       console.log(hash);
  //       if (err) return next(err);
  //       user.password = hash;
  //       next();
  //     });
  //   });
  // }

  if (user.isModified("password")) {
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(user.password, salt))
      .then((hash) => {
        user.password = hash;
        next();
      })
      .finally((err) => next(err));
  }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
