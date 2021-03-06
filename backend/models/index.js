const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const IndexSchema = new Schema(
  {
    term: String,
    documents: [
      {
        docId: String,
        TFIDF: Number
      }
    ]
  },
  { collection: 'index', timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Index", IndexSchema);
