const { getInput } = require('./utils')

// https://g.co/kgs/8UNmpu
function doctorDistance(p1, p2, q1, q2) {
    return Math.abs(p1 - q1) + Math.abs(p2 - q2)
}

function getCoordinate(record) {
    return record.split(', ').reduce((acc, item, index) => {
        if (index === 0) {
            acc['x'] = +item
        } else {
            acc['y'] = +item
        }

        return acc
    }, {})
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/6euATkyW')
    let input = data.split(/\r?\n/)

    let maxX = 0
    let maxY = 0
    coordinates = []
    input.forEach(line => {
        const coordinate = getCoordinate(line)
        maxX = Math.max(coordinate.x, maxX)
        maxY = Math.max(coordinate.y, maxY)
        coordinates.push(coordinate)
    })

    const bound = Math.max(maxX, maxY) + 1

    const grid = []
    for (let i = 0; i < bound; i += 1) {
        grid[i] = []

        for (let j = 0; j < bound; j += 1) {
            grid[i][j] = { id: '.', distance: Infinity }
            for ([index, { x, y }] of coordinates.entries()) {
                if (x === j && y === i) {
                    grid[i][j] = {
                        id: `${index}`,
                        distance: -1
                    }
                    continue
                }

                const distance = doctorDistance(x, y, j, i)

                if (grid[i][j].distance > distance) {
                    grid[i][j] = {
                        id: `${index}`,
                        distance
                    }
                } else if (grid[i][j].distance === distance) {
                    grid[i][j] = {
                        id: '.',
                        distance
                    }
                }
            }
        }
    }

    const points = {}
    const gems = {} // https://g.co/kgs/smVdzQ
    let maxArea = 0
    for (let i = 0; i < bound; i += 1) {
        for (let j = 0; j < bound; j += 1) {
            if (grid[i][j].id === '.') {
                continue
            }

            if (gems[grid[i][j].id] || i === bound - 1 || i === 0 || j === bound - 1 || j === 0) {
                gems[grid[i][j].id] = true

                if (maxArea === points[grid[i][j].id]) {
                    points[grid[i][j].id] = null
                    maxArea = 0

                    Object.keys(points).forEach(id => {
                        maxArea = Math.max(points[id], maxArea)
                    })

                }

                continue
            }

            points[grid[i][j].id] = points[grid[i][j].id] ? points[grid[i][j].id] + 1 : 1
            maxArea = Math.max(points[grid[i][j].id], maxArea)
        }
    }

    console.log(maxArea)
}

main()
