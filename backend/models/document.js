const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DocumentSchema = new Schema(
  {
    docId: String,
    TFIDF: Number
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Document", DocumentSchema);
