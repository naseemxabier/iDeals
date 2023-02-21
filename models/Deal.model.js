const { Schema, model } = require("mongoose");

const dealSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref:"user"},
    title: { type: String, unique: true, required: true },
    description: String,
    location: String, 
    filepath: {
        type: String,
         required: true
      }
  },
  { 
    timestamps: true
  }
  );

  const Deal = model("deal", dealSchema);

module.exports = Deal;