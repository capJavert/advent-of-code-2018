const { getInput } = require('./utils')

function compareByXy(a, b) {
    if (a.y < b.y) {
        return -1
    } else if (a.y > b.y) {
        return 1
    }

    if (a.x < b.x) {
        return -1
    } else if (a.x > b.x) {
        return 1
    }

    return 0
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/bwtmM7Vz')
    let input = data.split(/\r?\n/)

    const iProtocol = ['l', 's', 'r']
    const cornerProtocol = {
        '>\\': 'v',
        '>/': '^',

        'v\\': '>',
        'v/': '<',

        '^\\': '<',
        '^/': '>',

        '<\\': '^',
        '</': 'v',

        '>l+': '^',
        '>s+': '>',
        '>r+': 'v',

        '<r+': '^',
        '<s+': '<',
        '<l+': 'v',

        '^l+': '<',
        '^s+': '^',
        '^r+': '>',

        'vl+': '>',
        'vs+': 'v',
        'vr+': '<'
    }

    const schedule = input.reduce((acc, line, y) => {
        const data = line.split('')

        data.forEach((pos, x) => {
            const coord = `${x},${y}`
            switch (pos) {
                case ' ':
                    break
                case '|':
                case '^':
                case 'v':
                    acc.map[coord] = {
                        pos: '|',
                        t: c => {
                            switch (c.d) {
                                case '^':
                                    return { ...c, y: c.y -= 1 }
                                case 'v':
                                    return { ...c, y: c.y += 1 }
                                case '>':
                                    throw Error('> a |')
                                case '<':
                                    throw Error('> a |')
                                default:
                                    break
                            }
                        }
                    }
                    break
                case '\\':
                    acc.map[coord] = {
                        pos,
                        t: function(c) {
                            switch (cornerProtocol[c.d+pos]) {
                                case '^':
                                    return { ...c, y: c.y -= 1, d: cornerProtocol[c.d+pos] }
                                case 'v':
                                    return { ...c, y: c.y += 1, d: cornerProtocol[c.d+pos] }
                                case '>':
                                    return { ...c, x: c.x += 1, d: cornerProtocol[c.d+pos] }
                                case '<':
                                    return { ...c, x: c.x -= 1, d: cornerProtocol[c.d+pos] }
                                default:
                                    break
                            }
                        }
                    }
                    break
                case '-':
                case '>':
                case '<':
                    acc.map[coord] = {
                        pos: '-',
                        t: c => {
                            switch (c.d) {
                                case '^':
                                    throw Error('^ a -')
                                case 'v':
                                    throw Error('v a -')
                                case '>':
                                    return { ...c, x: c.x += 1 }
                                case '<':
                                    return { ...c, x: c.x -= 1 }
                                default:
                                    break
                            }
                        }
                    }
                    break
                case '/':
                    acc.map[coord] = {
                        pos,
                        t: function(c) {
                            switch (cornerProtocol[c.d+pos]) {
                                case '^':
                                    return { ...c, y: c.y -= 1, d: cornerProtocol[c.d+pos] }
                                case 'v':
                                    return { ...c, y: c.y += 1, d: cornerProtocol[c.d+pos] }
                                case '>':
                                    return { ...c, x: c.x += 1, d: cornerProtocol[c.d+pos] }
                                case '<':
                                    return { ...c, x: c.x -= 1, d: cornerProtocol[c.d+pos] }
                                default:
                                    break
                            }
                        }
                    }
                    break
                case '+':
                    acc.map[coord] = {
                        pos,
                        isI: true,
                        l: c => {
                            switch (c.d) {
                                case '^':
                                    return { ...c, x: c.x -= 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                case 'v':
                                    return { ...c, x: c.x += 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                case '>':
                                    return { ...c, y: c.y -= 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                case '<':
                                    return { ...c, y: c.y += 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                default:
                                    break
                            }
                        },
                        s: c => {
                            switch (c.d) {
                                case '^':
                                    return { ...c, y: c.y -= 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                case 'v':
                                    return { ...c, y: c.y += 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                case '>':
                                    return { ...c, x: c.x += 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                case '<':
                                    return { ...c, x: c.x -= 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                default:
                                    break
                            }
                        },
                        r: c => {
                            switch (c.d) {
                                case '^':
                                    return { ...c, x: c.x += 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                case 'v':
                                    return { ...c, x: c.x -= 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                case '>':
                                    return { ...c, y: c.y += 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                case '<':
                                    return { ...c, y: c.y -= 1, d: cornerProtocol[c.d+iProtocol[c.i]+pos], i: (c.i + 1) % 3 }
                                default:
                                    break
                            }
                        }
                    }
                    break
                default:
                    throw new Error(`unknown pos: ${pos}`)
            }

            switch (pos) {
                case '^':
                case 'v':
                case '>':
                case '<':
                    acc.carts.push({
                        x,
                        y,
                        d: pos,
                        cp: function() { return `${this.x},${this.y}` },
                        i: 0
                    })
                default:
                    break
            }
        })

        return acc
    }, { map: {}, carts: [] })

    let collision = false

    while (!collision) {
        schedule.carts.sort(compareByXy)

        for (let [index, oldCart] of schedule.carts.entries()) {
            const cart = {...oldCart}
            let newCart = null
            const pos = schedule.map[cart.cp()]

            switch (cart.d) {
                case '^':
                    newCart = pos.isI ? schedule.map[cart.cp()][iProtocol[cart.i]](cart) : schedule.map[cart.cp()].t({...cart})
                    break
                case 'v':
                    newCart = pos.isI ? schedule.map[cart.cp()][iProtocol[cart.i]](cart) : schedule.map[cart.cp()].t({...cart})
                    break
                case '>':
                    newCart = pos.isI ? schedule.map[cart.cp()][iProtocol[cart.i]](cart) : schedule.map[cart.cp()].t({...cart})
                    break
                case '<':
                    newCart = pos.isI ? schedule.map[cart.cp()][iProtocol[cart.i]](cart) : schedule.map[cart.cp()].t({...cart})
                    break
                default:
                    break
            }

            schedule.carts.forEach(eC => {
                if (eC.cp() === newCart.cp()) {
                    console.log(eC.cp())
                    collision = true
                }
            })

            schedule.carts[index] = {...newCart}
        }
    }
}

main()
