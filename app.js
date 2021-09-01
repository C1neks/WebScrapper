const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');



request('https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/sejny/?search%5Bdist%5D=10)',
    (error,response, html) => {
    if(!error && response.statusCode ==200) {
        const $ = cheerio.load(html);
        const postTitles = [];
        const postLinks = [];
        const postImgs = [];
        const postPrices = [];

        $('h3 > a > strong').each((i, el) => {
            const postTitle = $(el).text()
            postTitles.push(postTitle)

        });

        $('.photo-cell > a').each((i,el)=>{
            const postLink = $(el).attr('href');
            postLinks.push(postLink);
        })

        $('img').each((i,el)=>{
            const postImg = $(el).attr('src');
            postImgs.push(postImg);
        })

        $('.price > strong').each((i,el)=>{
            const postPrice = $(el).text();
            postPrices.push(postPrice);
        })
        console.log(postTitles,postLinks,postImgs,postPrices);

    }
});






