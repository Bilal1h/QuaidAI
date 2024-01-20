const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  bio: String,
  profileImage: String,
  webs: [{ type: mongoose.Schema.Types.ObjectId, ref: "website" }],
});

// Add passportLocalMongoose as a plugin to your schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);
