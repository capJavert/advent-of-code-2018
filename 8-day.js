const { getInput } = require('./utils')

async function main() {
    const data = await getInput('https://pastebin.com/raw/UnurN3Qg')
    let input = data.split(' ')

    const tree = []
    let header = []
    let parents = []
    let isMetaData = 0
    let metaSum = 0

    input.forEach(n => {
        const current = tree[parents[parents.length - 1]]
        if (current) {
            if (!current.header[0] && current.header[1]) {
                metaSum += +n
                current.meta.push(+n)
                current.header[1] -= 1

                if (!current.header[1]) {
                    parents.pop()
                }
                return
            }
        }

        header.push(+n)

        if (header.length > 1) {
            const id = tree.length
            tree[id] = { id, header: [...header], children: [], meta: [] }

            if (current && current.header[0]) {
                current.header[0] -= 1
                current.children.push(id)
            }
            parents.push(id)
            header = []
        }

        if (current && !current.header[0] && !current.header[1]) {
            parents.pop()
        }
    })

    console.log(metaSum)
}

main()
