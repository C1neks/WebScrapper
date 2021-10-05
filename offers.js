const express = require("express");
const router = express.Router();
const Offer = require("./models/Offer.js");

router.get("/", function (req, res) {
  console.log(req.query);
  const isDescOrAsc = "asc" in req.query ? "asc" : "desc";
  Offer.find({})
    .sort({ [req.query.sort]: isDescOrAsc })
    .exec(function (err, offers) {
      if (err) {
        console.log(err);
      } else {
        res.json({ offers: offers });
      }
    });
});

router.get("/:offerId", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId);
    res.json(offer);
  } catch (err) {
    res.status(404).send("Not found.");
  }
});

module.exports = router;
