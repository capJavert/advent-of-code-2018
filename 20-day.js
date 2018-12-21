const { getInput } = require('./utils')

const paths = []

async function main() {
    const data = await getInput('https://pastebin.com/raw/fY4z5gpR')
    // const data = 'ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN'
    // const data = 'ENWWW(NEEE|SSE(EE|N))'
    // const data = 'WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))'
    // ENWWWNEEE
    // ENWWWSSEEE
    // ENWWWSSEN
    let input = data.split('')

    let path = ''
    const stack = []
    const rootParent = { parent: null, path: '', branches: [] }
    let lastParent = rootParent
    for (let index = 0; index < input.length; index += 1) {
        const c = input[index]

        if (['^', '$'].indexOf(c) > -1) {
            continue
        }

        if (c === '(') {
            lastParent.branches.push({ parent: lastParent, path, branches: [] })
            lastParent = lastParent.branches[lastParent.branches.length - 1]
            path = ''
            continue
        }

        if (c === '|') {
            // console.log(lastParent)
            if (input[index + 1] === ')') {
                lastParent.branches.push({ parent: lastParent, path, branches: [], isOptional: true })
                lastParent = lastParent.branches[lastParent.branches.length - 1]
            } else {
                lastParent.branches.push({ parent: lastParent, path, branches: [] })
            }

            path = ''
            continue
        }

        if (c === ')') {
            if (path.length) {
                lastParent.branches.push({ parent: lastParent, path, branches: [] })
            }
            path = ''
            continue
        }

        path += c
    }

    getChildren('', rootParent, 0)
    console.log(paths)

    let maxDoors = 0
    paths.forEach(path => {
        maxDoors = Math.max(path.length, maxDoors)
    })

    console.log(maxDoors)
}

function getChildren(path, element, delimiter) {
    if (element.isOptional) {
        if (!element.branches.length) {
            paths.push(path)
            return
        }

        element.branches.forEach(child => {
            // console.log(Array(delimiter).fill(' ').join(''), child.path)
            if (child) {
                getChildren(path, child, delimiter + 2)
            }
        })
    }

    path += element.path

    if (!element.branches.length) {
        paths.push(path)
        return
    }

    element.branches.forEach(child => {
        // console.log(Array(delimiter).fill(' ').join(''), child.path)
        if (child) {
            getChildren(path, child, delimiter + 2)
        }
    })

}

main()
