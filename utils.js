const http = require('axios')
const fs = require("fs")

const utils = {
    getInput: async (url) => {
        const response = await http.get(url, { responseType: 'text' })
        return response.data
    },
    pause: () => {
        const fd = fs.openSync("/dev/stdin", "rs")
        fs.readSync(fd, Buffer.alloc(1), 0, 1)
        fs.closeSync(fd)
    }
}

module.exports = utils
