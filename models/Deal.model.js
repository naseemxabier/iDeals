const { Schema, model } = require("mongoose");

const dealtSchema = new Schema({
    creator: [{type: Schema.Types.ObjectId, ref:"User"}],
    title: { type: String, unique: true, required: true },
    description: String,
    place: String,
    image: String, /* (?????), */
    created :{
      type: Date,
      default : Date.now
    }
  });