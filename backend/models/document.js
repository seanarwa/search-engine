const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DocumentSchema = new Schema(
  {
    relativePath: String,
    URL: String,
    tokens: [
      {
        term: String,
        occurances: Number
      }
    ]
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Document", DocumentSchema);
