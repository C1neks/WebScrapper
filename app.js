const cheerio = require('cheerio');
const fs = require('fs');
const {default: axios} = require('axios');
const {getHtml} = require('./app2');
const {html} = require('cheerio/lib/api/manipulation');
const baseUrl = 'https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/sejny/?search%5Bdist%5D=10)';

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
        data = JSON.parse(fs.readFileSync('results.json'));
    } catch (err) {
        console.log("File not found!");
    }


    const SELECTORS_OLX = {
        wrapper: '.offer-wrapper',
        head: 'h3 > a > strong',
        link: '.photo-cell > a',
        img: 'img',
        price: '.price > strong',
        title: '[data-cy="ad_title"]',
        description: '[data-cy="ad_description"] div',
        area: 'li:nth-last-of-type(2) > p',
        unit: 'li:nth-last-of-type(1) > p'
    }

    const SELECTORS_OTODOM = {
        title: '[data-cy="adPageAdTitle"]',
        price: '[aria-label="Cena"]',
        img: 'div > picture',
        description: '[data-cy="adPageAdDescription"]',
        area: 'div > [aria-label="Powierzchnia"] > .css-1ytkscc'
    }

    const saveData = (data, file) => {
        const finished = (error) => {
            if (error) {
                console.error(error)
                return;
            }
        }

        const jsonData = JSON.stringify(data, null, 2)
        fs.writeFile(file, jsonData, finished)
        console.log('saved')
    }


    const saveOffer = async (result) => {
        result.forEach(index => {
            data["Offers"] = result
            saveData(data, 'results.json')
        })
    }

    const getOfferLinks = async () => {

        const html = await getHtml(baseUrl);
        const $ = cheerio.load(html);

        $(SELECTORS_OLX.wrapper).each((i, el) => {
            const link = $(el)
                .find(SELECTORS_OLX.link)
                .attr('href')
            links = [...links, link]
        })
        return links
    }

    const getOfferDetails = async () => {
        const urls = await getOfferLinks()

        for (const index of urls) {

            const html = await getHtml(index);
            const $ = cheerio.load(html);
            // console.log(index)

            if (index.includes("otodom")) {
                $(SELECTORS_OTODOM.title).each((i, el) => {
                    const title = $(el)
                        .text()
                    titles = [...titles, title]
                })
                $(SELECTORS_OTODOM.price).each((i, el) => {
                    const priceInString = $(el)
                        .text()
                        .replace(/ /g, '');
                    let price = parseInt(priceInString)
                    let currency = priceInString.slice(-2)
                    prices = [...prices, price]
                    currencies = [...currencies, currency]
                })
                $(SELECTORS_OTODOM.img).each((i, el) => {
                    const img = $(el)
                        .find(SELECTORS_OLX.img)
                        .attr('src')
                    imgs = [...imgs, img]
                    // console.log(img)
                })
                $(SELECTORS_OTODOM.description).each((i, el) => {
                    const description = $(el)
                        .text()
                    descriptions = [...descriptions, description]
                })
                $(SELECTORS_OTODOM.area).each((i, el) => {
                    const areaInString = $(el)
                        .text()
                        .replace(/\D/g, "");
                    let area = parseInt(areaInString)
                    areas = [...areas, area]
                    const unitInString = $(el)
                        .text()
                    let unit = unitInString.slice(-2)
                    units = [...units, unit]
                })


                // console.log("otodom")
            } else {
                $(SELECTORS_OLX.title).each((i, el) => {
                    const title = $(el)
                        .text()
                    titles = [...titles, title]

                });

                $('[data-testid=ad-price-container] > h3').each((i, el) => {
                    const priceInString = $(el)
                        .text()
                        .replace(/ /g, '');
                    let price = parseInt(priceInString)
                    let currency = priceInString.slice(-2)
                    prices = [...prices, price]
                    currencies = [...currencies, currency]
                    // console.log(price);
                    // console.log(currency);
                })
                $('div > .swiper-container').each((i, el) => {
                    const img = $(el)
                        .find(SELECTORS_OLX.img)
                        .attr('src')
                    imgs = [...imgs, img]
                    // console.log(img)
                })
                $(SELECTORS_OLX.description).each((i, el) => {
                    const description = $(el)
                        .text()
                    descriptions = [...descriptions, description]
                    // console.log(description)
                })

                $('.css-sfcl1s').each((i, el) => {
                    let areaInString = $(el)
                        .find(SELECTORS_OLX.area)
                        .text()
                        .replace(/\D/g, "");
                    let area = parseInt(areaInString)
                    areas = [...areas, area]
                    // console.log(areaInString);
                    let priceForMeter = $(el)
                        .find(SELECTORS_OLX.unit)
                        .text()
                    priceForMeters = [...priceForMeters, priceForMeter]
                    let unit = priceForMeter.slice(-2)
                    units = [...units, unit]

                })


            }
        }



    }
    await getOfferDetails()


        let result = links.map((id, index) => {
            return {
                link: id,
                title: titles[index],
                price: prices[index],
                currency: currencies[index],
                img: imgs[index],
                description: descriptions[index],
                area: areas[index],
                unit: units[index]

            }
        });


    await saveOffer(result)

}

Scrapper()



