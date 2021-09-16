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

    let data;
    try {
        data = JSON.parse(fs.readFileSync('results.json'));
    } catch (err) {
        console.log("File not found!");
    }


    const SELECTORS = {
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

    // class Post {
    //     constructor(link,title,price ,currency, img, description, area) {
    //         this.title = title;
    //         this.link = link;
    //         this.img = img;
    //         this.price = price;
    //         this.currency = currency;
    //         this.description = description;
    //         this.area = area;
    //     }
    // }

    // const saveOffer = async (title, link, img, price) => {
    //
    //     let newOffer = await new Post(title, link, img, price)
    //     data[newOffer.link] = newOffer
    //     saveData(data, 'results.json')
    // }
        const saveOffer = async (result) => {
            result.forEach(index => {
                data[result.link] = result
                saveData(data,'results.json')
            })
        }

    const getOfferLinks = async () => {

        const html = await getHtml(baseUrl);
        const $ = cheerio.load(html);

        $(SELECTORS.wrapper).each((i, el) => {
            const link = $(el)
                .find(SELECTORS.link)
                .attr('href')
            links = [...links, link]
        })
        return links
    }

    const getTitle = async () => {
        const urls = await getOfferLinks()

        for (const index of urls) {

            const html = await getHtml(index);
            const $ = cheerio.load(html);
            console.log(index)
            $(SELECTORS.title).each((i, el) => {
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
                prices = [...prices,price]
                currencies = [...currencies,currency]
                // console.log(price);
                // console.log(currency);
            })
            $('.swiper-zoom-container').each((i, el) => {
                const img = $(el)
                    .find(SELECTORS.img)
                    .attr('src')
                imgs = [...imgs,img]
                // console.log(img)
            })
            $(SELECTORS.description).each((i, el) => {
                const description = $(el)
                    .text()
                descriptions = [...descriptions,description]
                // console.log(description)
            })

            $('.css-sfcl1s').each((i, el) => {
                let areaInString = $(el)
                    .find(SELECTORS.area)
                    .text()
                    .replace(/\D/g, "");
                let area = parseInt(areaInString)
                areas = [...areas,area]
                // console.log(areaInString);
                let priceForMeter = $(el)
                    .find(SELECTORS.unit)
                    .text()
                let unit = priceForMeter.slice(-2)
                units = [...units,unit]

            })


        }
        // console.log(titles,prices,currencies,imgs,descriptions,areas)

        // console.log(urls)
        // return titles
    }
    await getTitle()
    getOfferLinks()
    let result = links.map((id,index) => {
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



