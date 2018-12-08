const { getInput } = require('./utils')

async function main() {
    const data = await getInput('https://pastebin.com/raw/UnurN3Qg')
    let input = data.split(' ')

    const tree = []
    let header = []
    let parents = []

    input.forEach(n => {
        const current = tree[parents[parents.length - 1]]
        if (current) {
            if (!current.header[0] && current.header[1]) {
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
                current.children.push(tree[id])
            }
            parents.push(id)
            header = []
        }

        if (current && !current.header[0] && !current.header[1]) {
            parents.pop()
        }
    })

    const rootValue = tree[0].meta.reduce((value, meta) => {
        if (tree[0].children.length) {
            value += tree[0].children[meta - 1] ? nodeValue(tree[0].children[meta - 1]) : 0
        } else {
            value += meta
        }

        return value
    }, 0)

    console.log(rootValue)
}

function nodeValue(node) {
    return node.meta.reduce((value, meta) => {
        if (node.children.length) {
            value += node.children[meta - 1] ? nodeValue(node.children[meta - 1]) : 0
        } else {
            value += meta
        }
        return value
    }, 0)
}

main()
