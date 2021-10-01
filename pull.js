const express = require("express");
const router = express.Router();
const Offer = require("./models/Offer.js");
const scrapper = require("./app");

router.post("/", async (req, res) => {
  const result = await scrapper.Scrapper(req.body.link);
  result.map((x) => {
    x = new Offer({
      link: x.link,
      title: x.title,
      price: x.price,
      currency: x.currency,
      img: x.img,
      description: x.description,
      area: x.area,
      unit: x.unit,
    });
    try {
      const savedOffer = x.save();
      res.json(savedOffer);
    } catch (err) {
      res.json(console.log(err));
    }
  });
});
module.exports = router;
