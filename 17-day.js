const { getInput, pause } = require('./utils')

function currentState(map, boundsI, boundsJ, c, silent) {
    for (let i = 0; i <= boundsI[1] + 1; i += 1) {
        // console.log(i)
        let line = ''

        if (!map[i]) {
            map[i] = {}
        }

        for (let j = boundsJ[0] - 1; j <= boundsJ[1] + 1; j += 1) {
            if (!map[i][j]) {
                map[i][j] = '.'
            }

            if (i === 0 && j === 500) {
                line += '+'
            } else if (i === c[0] && j === c[1]) {
                line += '|'
            } else {
                line += map[i][j]
            }
        }

        if (!silent) {
            console.log(line)
        }
    }
}

let boundsX = [Infinity, 0]
let boundsY = [Infinity, 0]
let veins = null

async function main() {
    // const data = await getInput('https://pastebin.com/raw/x76aZV0s')
    const data = await getInput('https://pastebin.com/raw/rdbr3Rp2')
    let input = data.split(/\r?\n/)

    veins = input.reduce((acc, line) => {
        let x = 0
        let y = 0
        let xData = line.split('x=')
        let yData = line.split('y=')

        if (xData[1].indexOf('y') > -1) {
            x = +xData[1].split(', ')[0]
        } else {
            xData = xData[1].split('..')
            x = [+xData[0], +xData[1]]
        }

        if (yData[1].indexOf('x') > -1) {
            y = +yData[1].split(', ')[0]
        } else {
            yData = yData[1].split('..')
            y = [+yData[0], +yData[1]]
        }

        if (Array.isArray(x)) {
            if (!acc[y]) {
                acc[y] = {}
            }

            boundsY[0] = Math.min(y, boundsY[0])
            boundsY[1] = Math.max(y, boundsY[1])

            for (let i = x[0]; i <= x[1]; i += 1) {
                boundsX[0] = Math.min(i, boundsX[0])
                boundsX[1] = Math.max(i, boundsX[1])
                acc[y][i] = '#'
            }
        } else {
            boundsX[0] = Math.min(x, boundsX[0])
            boundsX[1] = Math.max(x, boundsX[1])

            for (let i = y[0]; i <= y[1]; i += 1) {
                if (!acc[i]) {
                    acc[i] = {}
                }

                boundsY[0] = Math.min(i, boundsY[0])
                boundsY[1] = Math.max(i, boundsY[1])

                acc[i][x] = '#'
            }
        }
        return acc
    }, {})

    currentState(veins, boundsY, boundsX, [], true)
}

function fillFrom(c) {

}

function fillLevel(c) {

}

function hasBothWalls(c) {

}

main().then(() => {
    const maxY = boundsY[1]
    const minY = boundsY[0]
    const maxX = boundsX[1]
    const minX = boundsX[0]
    fillFrom(veins, [500, 0], fillFrom);
    currentState(veins, boundsY, boundsX, [0, 500])
})

// fillFrom(veins, [500, 0], fillFrom);
// printGrid(grid, '', '');

/* const flowing = pipe(grid.slice(minY, maxY + 1))(
  x => flatten<string>(x),
  sumBy(s => (s === '|' ? 1 : 0)),
);
const resting = pipe(grid.slice(minY, maxY + 1))(
  x => flatten<string>(x),
  sumBy(s => (s === '~' ? 1 : 0)),
);
console.log(flowing + resting);
console.log(resting); */

function fillFrom(grid, [x, y], self) {
    console.log(x, y)
  if (y >= maxY) return;
  if (grid[y + 1][x] === '.') {
    grid[y + 1][x] = '|';
    fillFrom(grid, [x, y + 1], self);
  }
  if ('#~'.includes(grid[y + 1][x]) && grid[y][x + 1] === '.') {
    grid[y][x + 1] = '|';
    fillFrom(grid, [x + 1, y], self);
  }
  if ('#~'.includes(grid[y + 1][x]) && grid[y][x - 1] === '.') {
    grid[y][x - 1] = '|';
    fillFrom(grid, [x - 1, y], self);
  }
  if (hasBothWalls(grid, [x, y])) fillLevel(grid, [x, y]);
}

function hasBothWalls(grid, pos) {
  return hasWall(grid, pos, 1) && hasWall(grid, pos, -1);
}
function hasWall(grid, [x, y], xOffset = 1) {
  let currentX = x;
  while (true) {
    if (grid[y][currentX] === '.') return false;
    if (grid[y][currentX] === '#') return true;
    currentX += xOffset;
  }
}

function fillLevel(grid, pos) {
  fillSide(grid, pos, 1), fillSide(grid, pos, -1);
}
function fillSide(grid, [x, y], xOffset = 1) {
  let currentX = x;
  while (true) {
    if (grid[y][currentX] === '#') return;
    grid[y][currentX] = '~';
    currentX += xOffset;
  }
}

// main()
