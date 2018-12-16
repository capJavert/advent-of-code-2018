const { getInput } = require('./utils')

async function main() {
    const data = await getInput('https://pastebin.com/raw/mLpP30yb')
    let input = data.split(/\r?\n/)

    const samples = input.reduce((acc, line) => {
        if (line.length > 0) {
            if (line.startsWith('Before')) {
                let sample = acc[acc.length - 1]
                if (sample.read) {
                    sample = {}
                    acc.push(sample)
                }
                sample.before = { ...eval(line.replace('Before: ', '')) }
            } else if (line.startsWith('After')) {
                let sample = acc[acc.length - 1]
                sample.after = { ...eval(line.replace('After: ', '')) }
                sample.read = true
            } else {
                let sample = acc[acc.length - 1]

                if (!sample.read) {
                    sample.instruction = { ...line.split(' ').map(item => +item) }
                }
            }
        }
        return acc
    }, [{}])

    const mutations = (r, i) => ({
        addr: {
            ...r,
            [i[3]]: r[i[1]] + r[i[2]]
        },
        addi: {
            ...r,
            [i[3]]: r[i[1]] + i[2]
        },
        mulr: {
            ...r,
            [i[3]]: r[i[1]] * r[i[2]]
        },
        muli: {
            ...r,
            [i[3]]: r[i[1]] * i[2]
        },
        banr: {
            ...r,
            [i[3]]: r[i[1]] & r[i[2]]
        },
        bani: {
            ...r,
            [i[3]]: r[i[1]] & i[2]
        },
        borr: {
            ...r,
            [i[3]]: r[i[1]] & r[i[2]]
        },
        bori: {
            ...r,
            [i[3]]: r[i[1]] & i[2]
        },
        setr: {
            ...r,
            [i[3]]: r[i[1]]
        },
        seti: {
            ...r,
            [i[3]]: i[1]
        },
        gtir: {
            ...r,
            [i[3]]: i[1] > r[i[2]] ? 1 : 0
        },
        gtri: {
            ...r,
            [i[3]]: r[i[1]] > i[2] ? 1 : 0
        },
        gtrr: {
            ...r,
            [i[3]]: r[i[1]] > r[i[2]] ? 1 : 0
        },
        eqir: {
            ...r,
            [i[3]]: i[1] === r[i[2]] ? 1 : 0
        },
        eqri: {
            ...r,
            [i[3]]: r[i[1]] === i[2] ? 1 : 0
        },
        eqrr: {
            ...r,
            [i[3]]: r[i[1]] === r[i[2]] ? 1 : 0
        }
    })

    let x3Samples = 0
    samples.forEach(sample => {
        let matchCount = 0
        const result = mutations(sample.before, sample.instruction)

        Object.keys(result).forEach(instruction => {
            if (JSON.stringify(result[instruction]) === JSON.stringify(sample.after)) {
                matchCount += 1
            }
        })

        if (matchCount > 2) {
            x3Samples += 1
        }
    })

    console.log(x3Samples)
}

main()
