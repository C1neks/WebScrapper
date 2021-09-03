const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('results.json'));

const saveData = (data,file) => {
    const finished = (error) => {
        if(error){
            console.error(error)
            return;
        }
    }
    const jsonData = JSON.stringify(data,null,2)
    fs.writeFile(file,jsonData,finished)
    console.log('saved')
}


request('https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/sejny/?search%5Bdist%5D=10)',
    (error,response, html) => {
    if(!error && response.statusCode ==200) {
        const $ = cheerio.load(html);
        // const postTitles = [];
        // const postLinks = [];
        // const postImgs = [];
        // const postPrices = [];

        function Post(title,link,img,price){
            this.title = title;
            this.link = link;
            this.img = img;
            this.price = price;
        }

        // const posts = {
        //     title: String,
        //     link: String,
        // }

        // $('h3 > a > strong').each((i, el) => {
        //     const postTitle = $(el).text()
        //     postTitles.push(postTitle)
        //
        // });
        //
        // $('.photo-cell > a').each((i,el)=>{
        //     const postLink = $(el).attr('href');
        //     postLinks.push(postLink);
        // })
        //
        // $('img').each((i,el)=>{
        //     const postImg = $(el).attr('src');
        //     postImgs.push(postImg);
        // })
        //
        // $('.price > strong').each((i,el)=>{
        //     const postPrice = $(el).text();
        //     postPrices.push(postPrice);
        // })
        // console.log(postTitles,postLinks,postImgs,postPrices);
        $('.offer-wrapper').each((i,el)=>{
            const title = $(el)
                .find('h3 > a > strong')
                .text();
            const link = $(el)
                .find('.photo-cell > a')
                .attr('href');
            const img = $(el)
                .find('img')
                .attr('src');
            const priceInString = $(el)
                .find('.price > strong')
                .text()
                .replace(/ /g,'');
            let price = parseInt(priceInString);
            console.log(title,link,img,price);



            const saveOffer = (title,link,img,price) => {

                let newOffer = new Post(title,link,img,price)
                data[newOffer.title] = newOffer
                saveData(data,'results.json')
            }
            saveOffer(title,link,img,price)
        })


    }
});






