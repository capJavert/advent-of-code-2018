
function getPower(x, y, serial) {
    const id = x + 10
    const power = ((id * y + serial) * id).toString()
    return power.length - 3 >= 0 ? +power[power.length - 3] - 5 : 0
}

async function main() {
    const serial = 1133
    let maxPower = 0
    let powerCell = null // https://g.co/kgs/7FG8M9

    for (let i = 1; i <= 298; i += 1) {
        for (let j = 1; j <= 298; j += 1) {
            let power = 0

            for (let x = i; x < i + 3; x += 1) {
                for (let y = j; y < j + 3; y += 1) {
                    power += getPower(x, y, serial)
                }
            }

            if (power > maxPower) {
                powerCell = `${i},${j}`
                maxPower = power
            }
        }
    }

    console.log(powerCell)
}

main()
