const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');



request('https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/sejny/?search%5Bdist%5D=10)',
    (error,response, html) => {
    if(!error && response.statusCode ==200) {
        const $ = cheerio.load(html);
        const postTitles = [];

        $('h3 > a > strong').each((i, el) => {
            const postTitle = $(el).text()
            postTitles.push(postTitle)

        });
        console.log(postTitles);


    }
});






