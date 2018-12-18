const { getInput, pause } = require('./utils')

function currentState(map, boundsI, boundsJ, c, silent) {
    for (let i = 0; i <= boundsI[1] + 1; i += 1) {
        // console.log(i)
        let line = ''

        if (!map[i]) {
            map[i] = {}
        }

        for (let j = boundsJ[0] - 1; j <= boundsJ[1] + 1; j += 1) {
            // console.log(j)
            if (i === 0 && j === 500) {
                line += '+'
            } else if (i === c[0] && j === c[1]) {
                line += 'X'
            } else {
                line += map[i][j] ? map[i][j] : '.'
            }
        }

        if (!silent) {
            console.log(line)
        }
    }
}

let boundsX = [Infinity, 0]
let boundsY = [Infinity, 0]
let veins = null

async function main() {
    //const data = await getInput('https://pastebin.com/raw/x76aZV0s')
    const data = await getInput('https://pastebin.com/raw/rdbr3Rp2')
    let input = data.split(/\r?\n/)

    veins = input.reduce((acc, line) => {
        let x = 0
        let y = 0
        let xData = line.split('x=')
        let yData = line.split('y=')

        if (xData[1].indexOf('y') > -1) {
            x = +xData[1].split(', ')[0]
        } else {
            xData = xData[1].split('..')
            x = [+xData[0], +xData[1]]
        }

        if (yData[1].indexOf('x') > -1) {
            y = +yData[1].split(', ')[0]
        } else {
            yData = yData[1].split('..')
            y = [+yData[0], +yData[1]]
        }

        if (Array.isArray(x)) {
            if (!acc[y]) {
                acc[y] = {}
            }

            boundsY[0] = Math.min(y, boundsY[0])
            boundsY[1] = Math.max(y, boundsY[1])

            for (let i = x[0]; i <= x[1]; i += 1) {
                boundsX[0] = Math.min(i, boundsX[0])
                boundsX[1] = Math.max(i, boundsX[1])
                acc[y][i] = '#'
            }
        } else {
            boundsX[0] = Math.min(x, boundsX[0])
            boundsX[1] = Math.max(x, boundsX[1])

            for (let i = y[0]; i <= y[1]; i += 1) {
                if (!acc[i]) {
                    acc[i] = {}
                }

                boundsY[0] = Math.min(i, boundsY[0])
                boundsY[1] = Math.max(i, boundsY[1])

                acc[i][x] = '#'
            }
        }
        return acc
    }, {})

    currentState(veins, boundsY, boundsX, [], true)
    // console.log(veins)

    const visited = {}
    let c = [0, 500]
    let hasCapacity = true
    /* while (hasCapacity) {
        hasCapacity = false

        let canMove = true
        while (canMove) {
            currentState(veins, boundsY, boundsX, [...c])
            pause()
            canMove = false


            if (down(c, veins) === '#') {
                c = down(c, veins, true)
                canMove = true
                hasCapacity = true
                continue
            } else if (down(c, veins) === '~') {

            }
            if (['#', '~'].indexOf(left(c, veins)) === -1) {
                c = left(c, veins, true)
                canMove = true
                hasCapacity = true
                continue
            } else if (['#', '~'].indexOf(right(c, veins)) === -1) {
                c = right(c, veins, true)
                canMove = true
                hasCapacity = true
                continue
            }
        }
    } */
    while (true) {
        flow(c, 'down')
    }

    let water = 0
    Object.keys(veins).forEach(i => {
        Object.keys(veins[i]).forEach(j => {
            if (veins[i][j] === '~') {
                water += 1
            }
        })
    })

    currentState(veins, boundsY, boundsX, c)
    console.log(water)
}

function flow(c, d = 'down') {
    currentState(veins, boundsY, boundsX, c)
    pause()

    if (c[0] <= boundsY[1]) {
        if (['.', undefined].indexOf(down(c)) > -1) {
            flow(down(c, true), 'down')
        } else {
            if (d === 'down') {
                veins[c[0]][c[1]] = '~'
                return
            }

            if (['.', undefined].indexOf(left(c)) > -1) {
                flow(left(c, true), 'left')
            } else if (['.', undefined].indexOf(down(left(c, true))) > -1) {
                flow(down(left(c, true), true), 'dleft')
            } else {
                if (d === 'left') {
                    veins[c[0]][c[1]] = '~'
                    return
                }
            }
            if (['.', undefined].indexOf(right(c)) > -1) {
                flow(right(c, true), 'right')
            } else if (['.', undefined].indexOf(down(right(c, true))) > -1) {
                flow(down(right(c, true), true), 'dright')
            } else {
                if (d === 'right') {
                    veins[c[0]][c[1]] = '~'
                    return
                }
            }
        }
    }
}

function down(c, move) {
    return !move ? veins[c[0] + 1][c[1]] : [c[0] + 1, c[1]]
}

function left(c, move) {
    return !move ? veins[c[0]][c[1] - 1] : [c[0], c[1] - 1]
}

function right(c, move) {
    return !move ? veins[c[0]][c[1] + 1] : [c[0], c[1] + 1]
}

main()
