const { getInput } = require('./utils')

function getDiff(a, b){
    const diff = []

    for (let i = 0; i < a.length; i += 1) {
        if (a[i] != b[i]) {
            diff.push(i)
        }
    }

    return diff
}

async function main() {
    const data = await getInput('https://pastebin.com/raw/B5PMXVxC')
    let input = data.split(/\r?\n/)

    try {
        input.forEach(a => {
            input.forEach(b => {
                const diff = getDiff(a, b)
                if (diff.length === 1) {
                    throw Error(a.substr(0, diff[0]) + a.substr(diff[0] + 1, a.length - 1))
                }
            })
        })
    } catch (e) {
        console.log(e.message)
    }
}

main()
