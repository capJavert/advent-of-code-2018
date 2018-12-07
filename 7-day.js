const { getInput } = require('./utils')

const path = []
const deps = {}
let ids = []

async function main() {
    const data = await getInput('https://pastebin.com/raw/PkDeVV6L')
    let input = data.split(/\r?\n/)

    input.forEach(line => {
        const data = line.split(' ')

        if (!deps[data[7]]) {
            deps[data[7]] = []
        }
        deps[data[7]].push(data[1])

        if (ids.indexOf(data[7]) === -1) {
            ids.push(data[7])
        }
        if (ids.indexOf(data[1]) === -1) {
            ids.push(data[1])
        }
    })

    assemble()
    console.log(path.join(''))
}

// https://youtu.be/hA6hldpSTF8
function assemble() {
    const available = []
    ids.forEach((id, index) => {
        let isAvailable = path.indexOf(id) === -1

        if (deps[id]) {
            deps[id].forEach(step => {
                if (path.indexOf(step) === -1) {
                    isAvailable = false
                }
            })
        }

        if (isAvailable) {
            available.push(id)
        }
    })

    available.sort()
    path.push(available.shift())

    if (path.length < ids.length) {
        assemble()
    }
}

main()
