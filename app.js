const cheerio = require('cheerio');
const fs = require('fs');
const {default: axios} = require('axios');
const {getHtml} = require('./app2');
const {html} = require('cheerio/lib/api/manipulation');
const {title} = require('process');
const links = [];
const titles = [];
const baseUrl = 'https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/sejny/?search%5Bdist%5D=10)';

const Scrapper = () => {

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
        area: 'li:nth-last-of-type(2) > p'
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

    class Post {
        constructor(title, link, img, price) {
            this.title = title;
            this.link = link;
            this.img = img;
            this.price = price;
        }
    }

    const saveOffer = async (title, link, img, price) => {

        let newOffer = await new Post(title, link, img, price)
        data[newOffer.link] = newOffer
        saveData(data, 'results.json')
    }


    const getData = async () => {

        const html = await getHtml(baseUrl);
        const $ = cheerio.load(html);

        $(SELECTORS.wrapper).each((i, el) => {
            const link = $(el)
                .find(SELECTORS.link)
                .attr('href')
            links.push(link)
            const head = $(el)
                .find(SELECTORS.head)
                .text();
            //  console.log(link)
            const img = $(el)
                .find(SELECTORS.img)
                .attr('src');
            const priceInString = $(el)
                .find(SELECTORS.price)
                .text()
                .replace(/ /g, '');
            let price = parseInt(priceInString);
            // console.log(head,link,img,price);
            saveOffer(head, link, img, price)
        })
        return links
    }

    const getTitle = async () => {
        const urls = await getData()

        urls.forEach((index) => {

            const html = getHtml(index);
            const $ = cheerio.load(html);
            console.log(index)
            $(SELECTORS.title).each((i, el) => {
                const title = $(el)
                    .text();
                titles.push(title)
                console.log(title)
            });

            $(SELECTORS.description).each((i, el) => {
                const description = $(el)
                    .text()
                console.log(description)
            })

            $('.css-sfcl1s').each((i, el) => {
                let areaInString = $(el)
                    .find(SELECTORS.area)
                    .text()
                    .replace(/ /g, '');
                let area = parseInt(areaInString)
                console.log(area);

            })

        })

        console.log(urls)
        return titles
    }
    getTitle()
    // getData()

}

Scrapper()



