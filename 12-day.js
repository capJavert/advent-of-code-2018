const { getInput } = require('./utils')

async function main() {
    const data = await getInput('https://pastebin.com/raw/yULnjSWW')
    let input = data.split(/\r?\n/)

    let leftMostPlant = Infinity
    let rightMostPlant = 0

    let pots = input.shift()
        .replace('initial state: ', '')
        .split('')
        .reduce((acc, state, index) => {
            if (state === '#') {
                leftMostPlant = Math.min(index, leftMostPlant)
                rightMostPlant = Math.max(index, rightMostPlant)
            }
            acc[index] = state
            return acc
        }, {})

    input.shift()
    const notes = input.reduce((acc, note) => {
        const data = note.split(' => ')
        acc[data[0]] = data[1]
        return acc
    }, {})

    for (let i = 1; i <= 20; i += 1) {
        const nextPots = {...pots}
        let nextLeftMostPlant = leftMostPlant
        let nextRightMostPlant = rightMostPlant

        for (let j = leftMostPlant - 5; j < rightMostPlant + 5; j += 1) {
            const set = `${pots[j - 2]||'.'}${pots[j - 1]||'.'}${pots[j]||'.'}${pots[j + 1]||'.'}${pots[j + 2]||'.'}`

            const replace = notes[set]
            if (replace === '#') {
                nextLeftMostPlant = Math.min(j, nextLeftMostPlant)
                nextRightMostPlant = Math.max(j, nextRightMostPlant)
            }

            nextPots[j] = replace || pots[j] || '.'
        }

        pots = {...nextPots}
        leftMostPlant = nextLeftMostPlant
        rightMostPlant = nextRightMostPlant
    }

    console.log(Object.keys(pots).reduce((acc, key) => {
        if (pots[key] === '#') {
            acc += +key
        }
        return acc
    }, 0))
}

main()
