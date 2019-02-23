const express = require("express");
const router = express.Router();
const Document = require("../models/document");

// this is our get method
// this method fetches all available data in our database
router.get("/get", (req, res) => {
  Document.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/update", (req, res) => {
  const { id, update } = req.body;
  Document.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/delete", (req, res) => {
  const { id } = req.body;
  Document.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/put", (req, res) => {
  let document = new Document();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  document.message = message;
  document.id = id;
  document.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

module.exports = router;
