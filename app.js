const cheerio = require("cheerio");
const fs = require("fs");
const { default: axios } = require("axios");
const { getHtml } = require("./getHtml");
const { html } = require("cheerio/lib/api/manipulation");
const baseUrl =
  "https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/sejny/?search%5Bdist%5D=10)";

const Scrapper = async () => {
  let links = [];
  let titles = [];
  let prices = [];
  let currencies = [];
  let imgs = [];
  let descriptions = [];
  let areas = [];
  let units = [];
  let priceForMeters = [];

  let data;
  try {
    data = JSON.parse(fs.readFileSync("results.json"));
  } catch (err) {
    console.log("File not found!");
  }

  const SELECTORS_OLX = {
    wrapper: ".offer-wrapper",
    head: "h3 > a > strong",
    link: ".photo-cell > a",
    img: "div > .swiper-container img",
    price: "[data-testid=ad-price-container] > h3",
    title: '[data-cy="ad_title"]',
    description: '[data-cy="ad_description"] div',
    area: ".css-sfcl1s li:nth-last-of-type(2) > p",
    unit: "li:nth-last-of-type(1) > p",
  };

  const SELECTORS_OTODOM = {
    title: '[data-cy="adPageAdTitle"]',
    price: '[aria-label="Cena"]',
    img: "div > picture img",
    description: '[data-cy="adPageAdDescription"]',
    area: 'div > [aria-label="Powierzchnia"] > .css-1ytkscc',
  };

  const saveData = (data, file) => {
    const finished = (error) => {
      if (error) {
        console.error(error);
        return;
      }
    };

    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(file, jsonData, finished);
    console.log("saved");
  };

  const saveOffer = async (result) => {
    result.forEach((index) => {
      data["Offers"] = result;
      saveData(data, "results.json");
    });
  };

  const getOfferLinks = async () => {
    const html = await getHtml(baseUrl);
    const $ = cheerio.load(html);

    $(SELECTORS_OLX.wrapper).each((i, el) => {
      const link = $(el).find(SELECTORS_OLX.link).attr("href");
      links = [...links, link];
    });
    return links;
  };
  const getOfferDetails = async () => {
    const urls = await getOfferLinks();
    let array = [];
    for (const url of urls) {
      const html = await getHtml(url);
      const $ = cheerio.load(html);
      // Promise.all
      const SELECTORS = url.includes("otodom")
        ? SELECTORS_OTODOM
        : SELECTORS_OLX;
      const title = $(SELECTORS.title).text();
      const priceInString = $(SELECTORS.price).text().replace(/ /g, "");
      const price = parseInt(priceInString);
      const currency = priceInString.slice(-2);
      const img = $(SELECTORS.img).attr("src");
      const description = $(SELECTORS.description).text();
      const area = parseInt($(SELECTORS.area).text().replace(/\D/g, ""));
      const unit = $(SELECTORS.area).text().slice(-2);
      array = [
        ...array,
        { link: url, title, price, currency, img, description, area, unit },
      ];
    }
    return array;
  };

  const result = await getOfferDetails();
  console.log(result);

  await saveOffer(result);
};

Scrapper();
