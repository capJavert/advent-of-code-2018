const { getInput } = require('./utils')

function checksum(str){
    let count = { two: 0, three: 0 }
    const repetitions = {}
    str.split('').forEach(c => {
        repetitions[c] = repetitions[c] ? repetitions[c] += 1 : 1
        if (repetitions[c] === 2) {
            count.two += 1
        }
        if (repetitions[c] === 3) {
            count.two -= 1
            count.three += 1
        }
        if (repetitions[c] > 3) {
            count.three -= 1
        }
    })

    return count
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/B5PMXVxC')
    let input = data.split(/\r?\n/)

    let twoLetterCount = 0
    let threeLetterCount = 0

    input.forEach(id => {
        const { two, three } = checksum(id)
        twoLetterCount += two ? 1 : 0
        threeLetterCount += three ? 1 : 0
    })

    console.log(twoLetterCount * threeLetterCount)
}

main()
