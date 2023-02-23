const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      /* required: false,
      unique: true,
      trim: true, */
    },
    email: {
      type: String,
      /* required: true, */
     /*  unique: true,
      trim: true,
      lowercase: true, */
      /* validate: [validateEmail, "Please fill a valid email adress"], */
      /* match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] */
    },
    password: {
      type: String,
      required: true,
    },
    /* posts:{
      type:[{type: Schema.Types.ObjectId, ref:"deal"}],
    }, */
    notification: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type:Boolean,
    default:false},
    avatar: {
      type: String
  }
},
  {
    timestamps: true,
  }
);

const User = model("user", userSchema);

module.exports = User;
