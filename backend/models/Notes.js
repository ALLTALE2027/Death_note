const mongoose = require("mongoose");

const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, //user here is our foreign key   whose ref is user schema
  title: { type: String, required: true },

  description: { type: String, required: true },

  tag: { type: String },

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("notes", NotesSchema);
