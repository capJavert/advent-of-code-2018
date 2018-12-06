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

    let safeRegionSize = 0
    for (let i = 0; i < bound; i += 1) {
        for (let j = 0; j < bound; j += 1) {
            let distanceSum = 0
            for ([index, { x, y }] of coordinates.entries()) {
                distanceSum += doctorDistance(x, y, j, i)
            }

            if (distanceSum < 10000) {
                safeRegionSize += 1
            }
        }
    }

    console.log(safeRegionSize)
}

main()
