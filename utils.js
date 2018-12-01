const http = require('axios')

const utils = {
    getInput: async (url) => {
        const response = await http.get(url, { responseType: 'text' })
        return response.data
    }
}

module.exports = utils
