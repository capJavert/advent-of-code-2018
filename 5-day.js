const { getInput } = require('./utils')

async function main() {
    const data = await getInput('https://pastebin.com/raw/kEAfUP8X')
    let input = data.trim()

    const units = 'qwertyuiopasdfghjklzxcvbnm'.split('')
    const regex = new RegExp(units.reduce((acc, unit) => {
        if (acc.length) {
            acc += '|'
        }

        acc += `(${unit}${unit.toUpperCase()}|${unit.toUpperCase()}${unit})`
        return acc
    }, ''))

    while (true) {
        const length = input.length
        input = input.replace(regex, '')

        if (length === input.length) {
            break
        }
    }

    console.log(input.length)
}

main()
