async function main() {
    let input = 880751

    const recepies = [3, 7]
    let mario = 0
    let luigi = 1

    let steps = input
    while (steps > -10) {
        const newRecepies = (recepies[mario] + recepies[luigi] + '').split('')
        newRecepies.forEach(recepie => {
            recepies.push(+recepie)
        })

        mario = (mario + (recepies[mario] + 1)) % recepies.length
        luigi = (luigi + (recepies[luigi] + 1)) % recepies.length

        steps -= newRecepies.length
    }

    console.log(recepies.slice(input, input + 10).join(''))
}

main()
