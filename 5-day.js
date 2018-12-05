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

    let minLength = Infinity
    units.forEach(unit => {
        const tempRegex = new RegExp(`${unit}|${unit.toUpperCase()}`, 'g')
        let temp = input.replace(tempRegex, '')

        while (true) {
            const length = temp.length
            temp = temp.replace(regex, '')

            if (length === temp.length) {
                break
            }
        }

        if (temp.length < minLength) {
            minLength = temp.length
            console.log(minLength)
        }
    })
}

main()
