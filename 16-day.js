const { getInput } = require('./utils')

async function main() {
    const data = await getInput('https://pastebin.com/raw/mLpP30yb')
    let input = data.split(/\r?\n/)

    const intel = input.reduce((acc, line) => {
        if (line.length > 0) {
            if (line.startsWith('Before')) {
                let sample = acc.samples[acc.samples.length - 1]
                if (sample.read) {
                    sample = {}
                    acc.samples.push(sample)
                }
                sample.before = { ...eval(line.replace('Before: ', '')) }
            } else if (line.startsWith('After')) {
                let sample = acc.samples[acc.samples.length - 1]
                sample.after = { ...eval(line.replace('After: ', '')) }
                sample.read = true
            } else {
                let sample = acc.samples[acc.samples.length - 1]
                const instruction = { ...line.split(' ').map(item => +item) }

                if (!sample.read) {
                    sample.instruction = instruction
                } else {
                    acc.code.push(instruction)
                }
            }
        }
        return acc
    }, { samples: [{}], code: [] })

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
            [i[3]]: r[i[1]] | r[i[2]]
        },
        bori: {
            ...r,
            [i[3]]: r[i[1]] | i[2]
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
    let instructionsMap = { banr: 6 } // blocker assigned here

    while(Object.keys(instructionsMap).length < 16) {
        intel.samples.forEach(sample => {
            let matches = []
            const result = mutations(sample.before, sample.instruction)

            Object.keys(result).forEach(instruction => {
                if (JSON.stringify(result[instruction]) === JSON.stringify(sample.after)) {
                    if (!instructionsMap[instruction]) {
                        matches.push(instruction)
                    }
                }
            })

            if (matches.length === 1 && !instructionsMap[matches[0]]) {
                instructionsMap[matches[0]] = sample.instruction[0]
            }
        })
    }

    instructionsMap['banr'] = 0 // blocker reassigned here
    instructionsMap = Object.keys(instructionsMap).reduce((acc, instruction) => {
        acc[instructionsMap[instruction]] = instruction
        return acc
    }, {})

    let registers = { ...[0, 0, 0, 0] }
    intel.code.forEach(instruction => {
        registers = mutations(registers, instruction)[instructionsMap[instruction, instruction[0]]]
    })

    console.log(registers[0])
}

main()
