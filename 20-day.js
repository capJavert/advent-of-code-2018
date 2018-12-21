const { getInput } = require('./utils')

const paths = []

function branchPath(current, regex, offset) {
    // console.log(current)
    let path = current

    let tempPath = ''
    for (let index = offset; index < regex.length; index += 1) {
        const c = regex[index]

        if (c === '|' || index === offset) {
            // console.log(path)
            index = readPath(path, regex, index + 1)
            continue
        }

        if (c === ')') {
            return index
        }
    }
}

function readPath(current, regex, offset) {
    // console.log(regex[offset])
    let path = current

    let savedPath = null
    for (let index = offset; index < regex.length; index += 1) {
        const c = regex[index]
        // console.log(c)

        if (['^', '$', ')'].indexOf(c) > -1) {
            continue
        }

        if (c === '(') {
            savedPath = path
            index = branchPath(path + regex[index], regex, index)

            continue
        }

        if (c === '|') {
            paths.push(path)
            return index - 1
        }

        path += c
    }
}

async function main() {
    // const data = await getInput('https://pastebin.com/raw/fY4z5gpR')
    const data = '^ENWWW(NEEE|SSE(EE|N))$'
    // ENWWWNEEE
    // ENWWWSSEEE
    // ENWWWSSEN
    let input = data.split('')

    // console.log(input.length)

    // console.log(regex[offset])
    let path = ''

    let savedPath = null
    for (let index = 0; index < input.length; index += 1) {
        const c = input[index]
        // console.log(c)

        if (['^', '$', ')'].indexOf(c) > -1) {
            continue
        }

        if (c === '(') {
            savedPath = path
            index = branchPath(path, input, index)

            continue
        }

        path += c
    }

    if (path !== savedPath) {
        paths.push(path)
    }

    console.log(paths)
}

main()
