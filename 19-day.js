const { getInput } = require('./utils')

async function main() {
    const data = await getInput('https://pastebin.com/raw/x2zfStu5')
    let input = data.split(/\r?\n/)

    const code = input.reduce((acc, line) => {
        if (line.length > 0) {
            const instruction = { ...line.split(' ').map(
                (item, index) => index === 0 ? item : +item
            )}
            acc.push(instruction)
        }
        return acc
    }, [])

    const mutations = {
        addr: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] + r[i[2]]
        }),
        addi: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] + i[2]
        }),
        mulr: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] * r[i[2]]
        }),
        muli: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] * i[2]
        }),
        banr: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] & r[i[2]]
        }),
        bani: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] & i[2]
        }),
        borr: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] | r[i[2]]
        }),
        bori: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] | i[2]
        }),
        setr: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]]
        }),
        seti: (r, i) => ({
            ...r,
            [i[3]]: i[1]
        }),
        gtir: (r, i) => ({
            ...r,
            [i[3]]: i[1] > r[i[2]] ? 1 : 0
        }),
        gtri: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] > i[2] ? 1 : 0
        }),
        gtrr: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] > r[i[2]] ? 1 : 0
        }),
        eqir: (r, i) => ({
            ...r,
            [i[3]]: i[1] === r[i[2]] ? 1 : 0
        }),
        eqri: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] === i[2] ? 1 : 0
        }),
        eqrr: (r, i) => ({
            ...r,
            [i[3]]: r[i[1]] === r[i[2]] ? 1 : 0
        })
    }
    const exec = (r, i) => mutations[i[0]](r, i)

    const pointer = code.shift()[1]
    let registers = { ...[0, 0, 0, 0, 0, 0] }

    while (registers[pointer] > -1 && registers[pointer] < code.length - 1) {
        const instruction = code[registers[pointer]]
        registers = exec(registers, instruction)
        registers[pointer] += 1
    }

    console.log(registers[0])
}

main()
