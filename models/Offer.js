const mongoose = require("mongoose");

const OfferSchema = mongoose.Schema({
  link: String,
  title: String,
  price: Number,
  currency: String,
  img: String,
  description: String,
  area: Number,
  unit: String,
});

module.exports = mongoose.model("Offers", OfferSchema);
