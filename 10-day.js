const { getInput } = require('./utils')

function doctorDistance(p1, p2, q1, q2) {
    return Math.abs(p1 - q1) + Math.abs(p2 - q2)
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/asrJ2K3A')
    // const data = await getInput('https://pastebin.com/raw/44b8VxJf')
    let input = data.split(/\r?\n/)

    const coords = input.reduce((acc, line) => {
        const data = line.split('> velocity=<')
        const coord = {
            y: +data[0].split(', ')[0].replace('position=<', '').replace(',', '').trim(),
            x: +data[0].split(', ')[1].replace('>', '').trim(),
            mY: +data[1].split(', ')[0].trim(),
            mX: +data[1].split(', ')[1].replace('>', '').trim()
        }
        acc.push(coord)
        return acc
    }, [])

    let sweetSpot = Infinity
    let sweetSeconds = 0
    let messageMap = null
    let boundsX = [0, 0]
    let boundsY = [0, 0]
    let i = 0
    while(i < 11111) {
        i += 1
        let maxX = 0
        let maxY = 0

        const map = coords.reduce((acc, coord) => {
            coord.x += coord.mX
            coord.y += coord.mY

            acc[`${coord.x}:${coord.y}`] = true

            bounds = []
            maxX = Math.max(coord.x, maxX)
            maxY = Math.max(coord.y, maxY)

            return acc
        }, [])

        if (maxX < sweetSpot) {
            sweetSpot = maxX
            bounds = [maxX, maxY]
            sweetSeconds = i
            messageMap = map
        }
    }

    console.log(sweetSeconds)

    for (let x = 0; x < bounds[0] + 1; x += 1) {
        let message = ''

        for (let y = 0; y < bounds[1] + 1; y += 1) {
            message += messageMap[`${x}:${y}`] ? '# ' : '. '
        }

        console.log(message)
    }
}

main()
