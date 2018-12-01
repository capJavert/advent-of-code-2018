const { getInput } = require('./utils')

async function main() {
    const data = await getInput('https://pastebin.com/raw/EEbJZiEh')
    let input = data.split(/\r?\n/)

    const frequencies = {}
    let frequency = 0

    while (true) {
        try {
            input.forEach(change => {
                frequency += +change

                if (frequencies[frequency.toString()] !== undefined) {
                    throw BreakException
                }

                frequencies[frequency.toString()] = frequency
            })
        } catch (e) {
            break
        }
    }

    console.log(frequency)
}

main()
