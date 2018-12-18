const { getInput, pause } = require('./utils')

function currentState(map, boundsI, boundsJ, c, silent) {
    for (let i = boundsI[0] - 1; i <= boundsI[1]; i += 1) {
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

async function main() {
    // const data = await getInput('https://pastebin.com/raw/x76aZV0s')
    const data = await getInput('https://pastebin.com/raw/rdbr3Rp2')
    let input = data.split(/\r?\n/)

    let boundsX = [Infinity, 0]
    let boundsY = [Infinity, 0]
    let veins = input.reduce((acc, line) => {
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
    let c0 = 0
    let c1 = 500
    let canMove = true
    let stream = []
    let marianaTrench = false // https://goo.gl/RvNq8K
    let reset = null
    const floadedLeft = {}
    const floadedRight = {}
    let lastDirection = 'down'
    while (canMove) {
        console.log(c0, c1)
        currentState(veins, boundsY, boundsX, [c0, c1])
        pause()
        canMove = false

        console.log(floadedLeft, floadedRight)
        if (floadedRight[`${c0},${c1}`] && floadedLeft[`${c0},${c1}`]) {
            const c = stream.pop()
            console.log(c)
            c0 = c[0]
            c1 = c[1]
            canMove = true
            continue
        }

        if (lastDirection === 'left' || lastDirection === 'right') {
            if ((veins[c0 + 1][c1 - 1] === '.' || veins[c0 + 1][c1 - 1] === undefined) &&
                (veins[c0][c1 - 1] === '.' || veins[c0][c1 - 1] === undefined) &&
                (veins[c0 + 1] && veins[c0 + 1][c1] === '~') &&
                (veins[c0 + 2] && veins[c0 + 2][c1] === '~') &&
                reset
            ) {
                veins = JSON.parse(reset.veins)
                const c = reset.c
                c0 = c[0]
                c1 = c[1]
                floadedLeft[`${c[0]},${c[1]}`] = true
                canMove = true
                continue
            }

            if ((veins[c0 + 1][c1 + 1] === '.' || veins[c0 + 1][c1 + 1] === undefined) &&
                (veins[c0][c1 + 1] === '.' || veins[c0][c1 + 1] === undefined) &&
                (veins[c0 + 1] && veins[c0 + 1][c1] === '~') &&
                (veins[c0 + 2] && veins[c0 + 2][c1] === '~') &&
                reset
            ) {
                veins = JSON.parse(reset.veins)
                const c = reset.c
                c0 = c[0]
                c1 = c[1]
                floadedRight[`${c[0]},${c[1]}`] = true
                canMove = true
                continue
            }
        }

        if (['#', '~'].indexOf(veins[c0 + 1][c1]) === -1 && c0 + 1 < boundsY[1]) {
            stream.push([c0, c1])
            c0 += 1
            veins[c0][c1] = '~'
            canMove = true
            marianaTrench = false
            lastDirection = 'down'
            continue
        } else if (c0 + 1 > boundsY[1]) {
            marianaTrench = true
        }

        /* if (c1 === 499 && c0 === 4) {
            console.log(['#', '~'].indexOf(veins[c0][c1 - 1]) === -1 &&
            ['#', '~'].indexOf(veins[c0 + 1][c1 - 1]) > -1 &&
            c1 - 1 >= boundsX[0])
            break
        } */

        if (
            ['#', '~'].indexOf(veins[c0][c1 - 1]) === -1 &&
            (['#', '~'].indexOf(veins[c0 + 1][c1 - 1]) > -1 || veins[c0 + 1][c1] === '#') &&
            !floadedLeft[`${c0},${c1}`]
        ) {
            stream.push([c0, c1])
            c1 -= 1
            veins[c0][c1] = '~'
            canMove = true
            lastDirection = 'left'
            continue
        } else if(!(['#', '~'].indexOf(veins[c0 + 1][c1 - 1]) > -1)) {
            // console.log(c)
            // break
        }

        if (
            ['#', '~'].indexOf(veins[c0][c1 + 1]) === -1 &&
            (['#', '~'].indexOf(veins[c0 + 1][c1 + 1]) > -1 || veins[c0 + 1][c1] === '#') &&
            !floadedRight[`${c0},${c1}`]
        ) {
            stream.push([c0, c1])
            c1 += 1
            veins[c0][c1] = '~'
            canMove = true
            lastDirection = 'right'
            continue
        }

        if (stream.length) {
            const c = stream.pop()
            c0 = c[0]
            c1 = c[1]
            reset = { veins: JSON.stringify(veins), c: [c0, c1] }
            canMove = true
            lastDirection = 'up'
        }
    }

    console.log(c0, c1)
}

main()
