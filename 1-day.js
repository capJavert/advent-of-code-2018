const http = require('axios')

async function getInput(url) {
    const response = await http.get(url, { responseType: 'text' })
    return response.data
}

(async () => {
    const data = await getInput('https://pastebin.com/raw/EEbJZiEh')
    const input = data.split(/\r?\n/)

    let frequency = 0
    input.forEach(change => {
        frequency += +change
    })

    console.log(frequency)
})()
