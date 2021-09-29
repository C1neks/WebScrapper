const express = require("express");
const router = express.Router();
const Offer = require("./models/Offer.js");

router.post("/", async (req, res) => {
  const offer = new Offer({
    link: req.body.link,
    title: req.body.title,
    price: req.body.price,
    currency: req.body.currency,
    img: req.body.img,
    description: req.body.description,
    area: req.body.area,
    unit: req.body.unit,
  });
  try {
    const savedOffer = await offer.save();
    res.json(savedOffer);
  } catch (err) {
    res.json(console.log(err));
  }
});

module.exports = router;
