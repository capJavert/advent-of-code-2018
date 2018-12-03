const { getInput } = require('./utils')

function overlap(rect1, rect2) {
    const leftX = Math.max( rect1.x, rect2.x );
    const rightX = Math.min( rect1.x+rect1.width, rect2.x+rect2.width );
    const topY = Math.max( rect1.y, rect2.y );
    const bottomY = Math.min( rect1.y+rect1.height, rect2.y+rect2.height );

    const intersectionRect = {
        x: leftX,
        y: topY,
        width: rightX - leftX,
        height: bottomY - topY
    }

    return intersectionRect.width > 0 && intersectionRect.height > 0 ? intersectionRect : false
}

function getRect(entry) {
    let data = entry.split(' ')

    return {
        id: data[0].replace('#', ''),
        x: +data[2].split(',')[0] + 1,
        y: +data[2].split(',')[1].replace(':', '') + 1,
        width: +data[3].split('x')[0],
        height: +data[3].split('x')[1]
    }
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/Gw8QMePU')
    let input = data.split(/\r?\n/)

    const overlaps = {}
    input.forEach(entry1 => {
        const rect1 = getRect(entry1)

        input.forEach(entry2 => {
            const rect2 = getRect(entry2)
            const overlapRect = overlap(rect1, rect2)
            if (rect1.id !== rect2.id && !overlaps[`${rect2.id}:${rect1.id}`] && overlapRect) {
                overlaps[`${rect1.id}:${rect2.id}`] = overlapRect
            }
        })
    })

    const conflicts = {}
    Object.keys(overlaps).forEach(key => {
        const conflict = overlaps[key]
        for (let i = 0; i < conflict.width; i++) {
            for (let j = 0; j < conflict.height; j++) {
                const conflictId = `${i + conflict.x}:${j + conflict.y}`
                if (!conflicts[conflictId]) {
                    conflicts[conflictId] = true
                }
            }
        }
    })

    console.log(Object.keys(conflicts).length)
}

main()
