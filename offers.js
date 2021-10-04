const express = require("express");
const router = express.Router();
const Offer = require("./models/Offer.js");

router.get("/", function (req, res) {
  Offer.find({})
    .sort(req.query.sort)
    .exec(function (err, offers) {
      if (err) {
        console.log(err);
      } else {
        res.json({ offers: offers });
      }
    });
});

router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.json(console.log(err));
  }
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
