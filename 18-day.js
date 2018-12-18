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

    let area = input.reduce((acc, line, y) => {
        if (!acc[y]) {
            acc[y] = []
        }

        line.trim().split('').forEach((state, x) => {
            acc[y][x] = state
        })

        return acc
    }, [])

    const cache = []
    const cacheMap = {}
    let min = 0
    let cacheSize = 0
    while (min < 1000000000) {
        cacheSize = cache.length
        const cacheKey = JSON.stringify(area)

        if (!cacheMap[cacheKey]) {
            const temp = []

            for (let i = 0; i < area.length; i += 1) {
                if (!temp[i]) {
                    temp[i] = []
                }

                for (let j = 0; j < area[0].length; j += 1) {
                    const adjecents = neighbors(j, i, area)
                    let countA = 0
                    let countB = 0

                    switch (area[i][j]) {
                        case '.':
                            countA = 0
                            adjecents.forEach(a => {
                                if (a === '|') {
                                    countA += 1
                                }
                            })

                            if (countA >= 3) {
                                temp[i][j] = '|'
                            } else {
                                temp[i][j] = '.'
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
                                temp[i][j] = '#'
                            } else {
                                temp[i][j] = '|'
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
                                temp[i][j] = '.'
                            } else {
                                temp[i][j] = '#'
                            }
                            break
                    }
                }
            }

            cacheMap[cacheKey] = cache.length

            cache.push(temp)
            area = temp
        } else {
            let i = cacheMap[cacheKey]
            const period = min - cacheMap[cacheKey]
            while ((i+1) % period != 1000000000 % period) {
                i += 1
            }

            const acresCount = cache[i].reduce((acc, line, y) => {
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
            break
        }

        min += 1
        // currentState(area) // uncomment for debug
    }
}

main()
