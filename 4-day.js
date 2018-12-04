const { getInput } = require('./utils')

async function main() {
    const data = await getInput('https://pastebin.com/raw/UkeLeTwV')

    let input = data.split(/\r?\n/)

    let schedule = input.map(line => {
        const guardData = line.split(' ')
        const record = {
            timestamp: new Date(line.split(']')[0].replace('[', '')),
            guardId: +guardData[3].replace('#', ''),
            action: (guardData[guardData.length - 2] + guardData[guardData.length - 1])
        }

        return record
    })

    schedule.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    let guardId = null
    let sleepyGuard = { id: null, asleep: 0 }

    const asleepSheet = schedule.reduce((acc, record) => {
        if (record.guardId) {
            guardId = record.guardId
        }

        const guard = acc[guardId] || { asleep: 0, sleepyMinute: { i: null, asleep: 0 }, minutes: {}, lastTs: null }

        switch (record.action) {
            case 'beginsshift':
            case 'fallsasleep':
                guard.lastTs = record.timestamp
                break
            case 'wakesup':
                for (let i = guard.lastTs.getMinutes(); i < record.timestamp.getMinutes(); i += 1) {
                    guard.minutes[i] = guard.minutes[i] ? guard.minutes[i] + 1 : 1
                    if (guard.minutes[i] > guard.sleepyMinute.asleep) {
                        guard.sleepyMinute = { i, asleep: guard.minutes[i] }
                    }
                }
                guard.asleep += Math.round((((record.timestamp - guard.lastTs) % 86400000) % 3600000) / 60000)

                if (guard.asleep > sleepyGuard.asleep) {
                    sleepyGuard = { id: guardId, asleep: guard.asleep }
                }
                break
        }

        acc[guardId] = guard
        return acc
    }, {})

    console.log(sleepyGuard.id * asleepSheet[sleepyGuard.id].sleepyMinute.i)
}

main()
