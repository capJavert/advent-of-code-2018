const { getInput } = require('./utils')

function currentState(map) {
    for (let i = 0; i < map.length; i += 1) {
        let line = ''

        for (let j = 0; j < map[0].length; j += 1) {
            line += map[i][j]
        }

        console.log(line)
    }
}

function neighbors(x, y, map) {
    const neighbors = []

    if (map[y - 1]) {
        neighbors.push(map[y - 1][x - 1])
        neighbors.push(map[y - 1][x])
        neighbors.push(map[y - 1][x + 1])
    }

    neighbors.push(map[y][x - 1])
    neighbors.push(map[y][x + 1])

    if (map[y + 1]) {
        neighbors.push(map[y + 1][x + 1])
        neighbors.push(map[y + 1][x])
        neighbors.push(map[y + 1][x - 1])
    }

    return neighbors
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/BE9cjHe9')
    let input = data.split(/\r?\n/)

    const area = input.reduce((acc, line, y) => {
        if (!acc[y]) {
            acc[y] = []
        }

        line.trim().split('').forEach((state, x) => {
            acc[y][x] = state
        })

        return acc
    }, [])

    let min = 0
    while (min < 10) {
        let temp = JSON.parse(JSON.stringify(area))

        for (let i = 0; i < temp.length; i += 1) {
            for (let j = 0; j < temp[0].length; j += 1) {
                const adjecents = neighbors(j, i, temp)
                let countA = 0
                let countB = 0

                switch (temp[i][j]) {
                    case '.':
                        countA = 0
                        adjecents.forEach(a => {
                            if (a === '|') {
                                countA += 1
                            }
                        })

                        if (countA >= 3) {
                            area[i][j] = '|'
                        }
                        break
                    case '|':
                        countA = 0
                        adjecents.forEach(a => {
                            if (a === '#') {
                                countA += 1
                            }
                        })

                        if (countA >= 3) {
                            area[i][j] = '#'
                        }
                        break
                    case '#':
                        countA = 0
                        countB = 0

                        adjecents.forEach(a => {
                            if (a === '#') {
                                countA += 1
                            } else if (a === '|') {
                                countB += 1
                            }
                        })

                        if (!countA || !countB) {
                            area[i][j] = '.'
                        }
                        break
                }
            }
        }

        min += 1
        // currentState(area) // uncomment for debug
    }

    const acresCount = area.reduce((acc, line, y) => {
        const temp = line.reduce((lacc, state, x) => {
            if (state === '|') {
                lacc.w += 1
            } else if (state === '#') {
                lacc.l += 1
            }
            return lacc
        }, { w: 0, l: 0 })

        acc.w += temp.w
        acc.l += temp.l
        return acc
    }, { w: 0, l: 0 })

    console.log(acresCount.w * acresCount.l)
}

main()
