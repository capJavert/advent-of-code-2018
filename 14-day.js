async function main() {
    let input = 880751

    const recepies = [3, 7]
    let mario = 0
    let luigi = 1

    let steps = 0
    while (true) {
        const newRecepies = (recepies[mario] + recepies[luigi] + '').split('')
        newRecepies.forEach(recepie => {
            recepies.push(+recepie)
        })

        mario = (mario + (recepies[mario] + 1)) % recepies.length
        luigi = (luigi + (recepies[luigi] + 1)) % recepies.length

        if (recepies.length % 1000000 === 0) {
            if (recepies.join('').indexOf(input + '') > -1) {
                console.log(recepies.join('').indexOf(input + ''))
                break
            }
        }
    }
}

main()
