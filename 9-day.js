function play(players, marbles) {
    const scores = {}

    const circle = {0: { value: 0, prev: 0, next: 0 }}
    let currentPlayer = 0
    let currentMarble = circle[0]
    let maxScore = 0

    for (let i = 1; i <= marbles; i += 1) {
        if (i % 23) {
            const next = circle[currentMarble.next]
            const next2 = circle[next.next]

            circle[i] = {
                value: i,
                prev: next.value,
                next: next2.value
            }

            next.next = i
            next2.prev = i

            currentMarble = circle[i]
        } else {
            let next7 = circle[currentMarble.prev]
            for (let j = 0; j < 6; j += 1) {
                next7 = circle[next7.prev]
            }

            if (!scores[currentPlayer]) {
                scores[currentPlayer] = 0
            }

            const prev = circle[next7.prev]
            currentMarble = circle[next7.next]
            prev.next = currentMarble.value
            currentMarble.prev = prev.value

            scores[currentPlayer] += i + next7.value
            maxScore = Math.max(scores[currentPlayer], maxScore)
            delete circle[next7.value]
        }

        currentPlayer = (currentPlayer + 1) % players
    }

    return maxScore
}

async function main() {
    console.log(
        play(405, 70953),
        play(405, 70953 * 100)
    )
}

main()
