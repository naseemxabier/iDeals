const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    notification: {
      type: String,
      default: "off",
      enum: ["on", "off"]
    },
    isAdmin: {
      type:Boolean,
    default:false},
    avatar: {
      type: String,
      default: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
  }
},
  {
    timestamps: true,
  }
);

const User = model("user", userSchema);

module.exports = User;
