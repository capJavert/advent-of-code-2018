
function getPower(x, y, serial) {
    const id = x + 10
    const power = ((id * y + serial) * id).toString()
    return power.length - 3 >= 0 ? +power[power.length - 3] - 5 : 0
}

async function main() {
    const serial = 1133
    let maxPower = 0
    let powerCell = null // https://g.co/kgs/7FG8M9
    let squares = {}

    for (let s = 1; s < 300; s += 1) {
        for (let i = 1; i <= 298; i += 1) {
            for (let j = 1; j <= 298; j += 1) {
                if (i + s > 300 || j + s > 300) {
                    continue
                }

                let power = 0

                if (s > 3) {
                    power += squares[`${i},${j},${s - 1}`]
                    power += squares[`${i + 1},${j + 1},${s - 1}`]
                    power -= squares[`${i + 1},${j + 1},${s - 2}`]
                    delete squares[`${i + 1},${j + 1},${s - 2}`] // optimize memory used by program
                    power += squares[`${i + s - 1},${j},1`]
                    power += squares[`${i},${j + s - 1},1`]
                } else {
                    const sS = i + s
                    for (let x = i; x < sS; x += 1) {
                        for (let y = j; y < j + s; y += 1) {
                            power += getPower(x, y, serial)
                        }
                    }
                }

                squares[`${i},${j},${s}`] = power

                if (power > maxPower) {
                    powerCell = `${i},${j},${s}`
                    maxPower = power
                }
            }
        }
    }

    console.log(powerCell)
}

main()
