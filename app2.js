const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('results.json'));

// const saveData = (data,file) => {
//     const finished = (error) => {
//         if(error){
//             console.error(error)
//             return;
//         }
//     }
//     const jsonData = JSON.stringify(data,null,2)
//     fs.writeFile(file,jsonData,finished)
//     console.log('saved')
// }
const descriptionSearch = function(link) {
    request(link,
        (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                $('li').each((i, el) => {
                    const details = $(el)
                        .find('p')
                        .text()
                        // .trim()
                        // .replace(/\s\s+/g,' ')
                    console.log(details);

                })
                $('.css-1m8mzwg').each((i, el) => {
                    const description = $(el)
                        .find('.css-g5mtbi-Text')
                        .text()
                    console.log(description);

                })

            }

        });
}


module.exports = descriptionSearch;
