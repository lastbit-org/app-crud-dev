const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/test", (req, res) => {
  res.json({ message: "Test route works!" });
});

module.exports = router;
