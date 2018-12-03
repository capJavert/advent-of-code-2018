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
        height: +data[3].split('x')[1],
        overlaps: []
    }
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/Gw8QMePU')
    let input = data.split(/\r?\n/)

    const rects = []
    input.forEach(entry1 => {
        const rect1 = getRect(entry1)

        input.forEach(entry2 => {
            const rect2 = getRect(entry2)
            const overlapRect = overlap(rect1, rect2)
            if (rect1.id !== rect2.id && overlapRect) {
                rect1.overlaps.push(overlapRect)
            }
        })

        rects.push(rect1)
    })

    rects.forEach(rect => {
        if (!rect.overlaps.length) {
            console.log(rect.id)
        }
    })
}

main()
