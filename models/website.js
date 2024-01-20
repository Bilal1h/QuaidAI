const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const webSchema = mongoose.Schema({
  username: String,
  name: String,
  title:String,
  email: String,
  about: String,
  address:String,
  user:[{
    type: mongoose.Schema.Types.ObjectId, ref: "user"
  }],
  style:String,
  
});

webSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("website", webSchema);
