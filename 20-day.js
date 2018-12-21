const { getInput } = require('./utils')

const paths = []

async function main() {
    // const data = await getInput('https://pastebin.com/raw/fY4z5gpR')
    // const data = 'ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN'
    const data = 'ENWWW(NEEE|SSE(EE|N))'
    // ENWWWNEEE
    // ENWWWSSEEE
    // ENWWWSSEN
    let input = data.split('')

    let path = ''
    const stack = []
    let savedPath = null
    let lastParent = stack
    for (let index = 0; index < input.length; index += 1) {
        const c = input[index]

        if (['^', '$'].indexOf(c) > -1) {
            continue
        }

        if (c === '(') {
            if (lastParent) {
                lastParent.push({ path, branches: [] })
                lastParent = lastParent[lastParent.length - 1].branches
            } else {
                stack.push({ path, branches: [] })
                lastParent = stack
            }
            path = ''
            continue
        }

        if (c === '|') {
            console.log(lastParent)
            lastParent.push(path)
            continue
        }

        if (c === ')') {
            /* if (path.length) {
                paths.push(stack.join('') + path)
            } */


            // path += stack.pop()
            continue
        }

        path += c
    }

    stack.forEach(e => {
        console.log(e)
        e.branches.forEach(e2 => {
            console.log('   ' + e2)
        })
    })

    return

    if (!paths.length) {
        paths.push(path)
    }

    console.log(paths)

    let maxDoors = 0
    paths.forEach(path => {
        maxDoors = Math.max(path.length, maxDoors)
    })

    console.log(maxDoors)
}

function getChildren(element){
    
}

main()
