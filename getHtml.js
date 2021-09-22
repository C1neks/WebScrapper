const axios = require('axios').default;

const getHtml = async (url) => {
    const response = await axios.get(url);
    return response.data
}

module.exports = {
    getHtml
}