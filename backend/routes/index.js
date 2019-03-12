const express = require("express");
const router = express.Router();
const Index = require("../models/index");
const natural = require('natural');
var tokenizer = new natural.WordTokenizer();

// this is our get method
// this method fetches all available data in our database
router.get("/get", (req, res) => {
  Index.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/get/:id", (req, res) => {
  var id = req.params.id;
  Index.find({_id: id}, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/search/:query", (req, res) => {
  var query = req.params.query;
  var words = tokenizer.tokenize(query);

  if(query.length == 0 || words.length == 0)
    return res.json({ success: false });

  var queryList = []
  words.forEach((word) => {
    queryList.push({term: word});
  });
  Index.find({ $or: queryList }, (err, data) => {
    if(err) {
      return res.json({ success: false, error: err });
    } else {

      var map = new Map();
      map[Symbol.iterator] = function* () {
          yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
      }

      var indexes = data;
      indexes.forEach(index => {
        var docs = index.documents;
        docs.forEach(doc => {
          var key = doc.docId;
          map.set(key, map.has(key) ? map.get(key) + doc.TFIDF : doc.TFIDF);
        });
      });

      var listings = []
      var counter = 0;
      for(let [docId, TFIDF] of map) {
        if(counter === 20) break;
        listings.push(docId);
        counter++;
      }
      return res.json({ success: true, data: listings });
    }

    // if (err) return res.json({ success: false, error: err });
    // return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/update", (req, res) => {
  const { id, update } = req.body;
  Index.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/delete", (req, res) => {
  const { id } = req.body;
  Index.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/put", (req, res) => {
  let index = new Index();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  index.message = message;
  index.id = id;
  index.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

module.exports = router;
