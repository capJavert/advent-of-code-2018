const { getInput } = require('./utils')
const aStar = require('a-star')
const Graph = require('node-dijkstra')

Object.prototype.toString = function() {
    return `${this.y},${this.x}`
}

function compareByXy(keyA, keyB) {
    const a = {
        x: +keyA.split(',')[1],
        y: +keyA.split(',')[0]
    }
    const b = {
        x: +keyB.split(',')[1],
        y: +keyB.split(',')[0]
    }

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

function doctorDistance(a, b) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y)
}

function neighbors({ x, y }, map) {
    const ret = [
        map[`${y - 1},${x}`],
        map[`${y},${x - 1}`],
        map[`${y},${x + 1}`],
        map[`${y + 1},${x}`]
    ]

    return ret
}

function mapToGraph(start, map) {
    const data = Object.keys(map).reduce((acc, key) => {
        const unit = map[key]
        if (unit.pos !== '#') {
            acc[key] = neighbors(unit, map).reduce((acc, item) => {
                if (item.pos === '.') {
                    acc[item.toString()] = doctorDistance(start, item) * item.index
                }
                return acc
            }, {})
        }

        return acc
    }, {})

    return new Graph(data)
}

function currentState(map, input) {
    for (let i = 0; i < input.length; i += 1) {
        let line = ''

        for (let j = 0; j < input[0].trim().length; j += 1) {
            line += map[`${i},${j}`].pos
        }

        console.log(line)
    }
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/tsW35y6x')
    let input = data.split(/\r?\n/)

    let index = 1
    const originalBattlefield = JSON.stringify(input.reduce((acc, line, y) => {
        line.trim().split('').forEach((pos, x) => {
            if (pos !== ' ') {
                const field = {
                    index,
                    pos, x, y,
                    toString: function() {
                        return `${this.y},${this.x}`
                    },
                    round: 0
                }
                if (pos === 'E' || pos === 'G') {
                    field.hp = 200
                }
                acc[field.toString()] = field
                index += 1
            }
        })
        return acc
    }, {}))

    let elfWasted = true
    let elfPower = 3

    while (elfWasted) {
        const battlefield = JSON.parse(originalBattlefield)
        elfPower += 1
        elfWasted = false
        let isEnd = false
        let rounds = 0
        while(!isEnd) {
            for (let keyA of Object.keys(battlefield).sort(compareByXy)) {
                let unitA = battlefield[keyA]

                if (unitA.pos === '.' || unitA.pos === '#' || unitA.round > rounds) {
                    continue
                }

                let closest = { d: Infinity, unit: null }
                let inRange = false
                let hasOpponents = false

                for (let neighbor of neighbors(unitA, battlefield)) {
                    if (neighbor.pos === (unitA.pos === 'G' ? 'E' : 'G')) {
                        inRange = true
                        hasOpponents = true
                        break
                    }
                }

                let closestPath = null

                if (!inRange) {
                    const movePositions = []

                    const graph = mapToGraph(unitA, battlefield)

                    for (let keyB of Object.keys(battlefield).sort(compareByXy)) {
                        const unitB = battlefield[keyB]

                        if (unitB.pos === unitA.pos || unitB.pos === '.' || unitB.pos === '#') {
                            continue
                        }

                        hasOpponents = true

                        for (let neighbor of neighbors(unitB, battlefield)) {
                            if (neighbor.pos === '.') {
                                movePositions.push(neighbor.toString())
                            }
                        }
                    }

                    for (let neighborKey of movePositions.sort(compareByXy)) {
                        const neighbor = battlefield[neighborKey]
                        const path = graph.path(unitA.toString(), neighbor.toString())

                        if (path !== null) {
                            path.shift()
                            if (!closestPath || closestPath.length > path.length) {
                                closestPath = path
                            } else if (closestPath.length === path.length) {
                                if (compareByXy(path[0], closestPath[0]) === -1) {
                                    closestPath = path
                                }
                            }
                        }
                    }
                }

                if (!hasOpponents) {
                    isEnd = true
                    break
                }

                if (closestPath) {
                    const closestPathElem = battlefield[closestPath[0]]
                    const move = {
                        ...unitA,
                        index: closestPathElem.index,
                        x: closestPathElem.x,
                        y: closestPathElem.y
                    }
                    battlefield[unitA.toString()] = {
                        ...closestPathElem,
                        index: unitA.index,
                        x: unitA.x,
                        y: unitA.y
                    }
                    battlefield[move.toString()] = move
                    unitA = battlefield[move.toString()]
                }

                let selectedTarget = null
                for (let target of neighbors(unitA, battlefield)) {
                    if (target.pos === (unitA.pos === 'G' ? 'E' : 'G')) {
                        if (!selectedTarget || target.hp < selectedTarget.hp) {
                            selectedTarget = target
                        }
                    }
                }

                if (selectedTarget) {
                    selectedTarget.hp -= unitA.pos === 'E' ? elfPower : 3

                    if (selectedTarget.hp <= 0) {
                        if (selectedTarget.pos === 'E') {
                            isEnd = true
                            elfWasted = true
                            break
                        }

                        delete selectedTarget.hp
                        selectedTarget.pos = '.'
                    }
                }

                unitA.round += 1
            }

            if (!isEnd) {
                rounds += 1
            }
        }

        const hpSum = Object.keys(battlefield).reduce((acc, key) => {
            const unit = battlefield[key]
            if (unit.hp) {
                acc += unit.hp
            }
            return acc
        }, 0)

        console.log(elfPower, rounds * hpSum)
    }
}

main()
