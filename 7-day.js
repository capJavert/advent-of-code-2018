const { getInput } = require('./utils')

const path = []
const deps = {}
const ids = []
const workers = [{ job: null, left: 0 }, { job: null, left: 0 }, { job: null, left: 0 }, { job: null, left: 0 }, { job: null, left: 0 }]
const progress = {}

function getFreeWorkers() {
    const free = null
    return workers.reduce((free, worker) => {
        if (worker.job) {
            worker.left -= 1

            if (!worker.left) {
                path.push(worker.job)
                delete progress[worker.job]
                worker.job = null
            }
        }

        if (!worker.job) {
            free.push(worker)
        }
        return free
    }, [])
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/PkDeVV6L')
    let input = data.split(/\r?\n/)

    input.forEach(line => {
        const data = line.split(' ')

        if (!deps[data[7]]) {
            deps[data[7]] = []
        }
        deps[data[7]].push(data[1])

        if (ids.indexOf(data[7]) === -1) {
            ids.push(data[7])
        }
        if (ids.indexOf(data[1]) === -1) {
            ids.push(data[1])
        }
    })
    ids.sort()
    const values = ids.reduce((acc, id, index) => {
        acc[id] = index + 61
        return acc
    }, {})

    let time = 0
    while (path.length < ids.length) {
        const freeWorkers = getFreeWorkers()
        const jobs = assemble()

        if (jobs.length) {
            freeWorkers.forEach((worker, index) => {
                const job = jobs[index]

                if (job) {
                    worker.job = job
                    worker.left = values[job]
                    progress[job] = true
                }
            })
        }

        time += 1
    }

    console.log(time - 1)
}

// https://youtu.be/hA6hldpSTF8
function assemble() {
    const available = []
    ids.forEach((id, index) => {
        let isAvailable = path.indexOf(id) === -1

        if (deps[id]) {
            deps[id].forEach(step => {
                if (path.indexOf(step) === -1) {
                    isAvailable = false
                }
            })
        }

        if (isAvailable) {
            available.push(id)
        }
    })

    available.sort()

    const jobs = []
    for (job of available) {
        if (!progress[job]) {
            jobs.push(job)
        }
    }

    return jobs
}

main()
