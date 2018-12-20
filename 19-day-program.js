
/*

// main loop which is looking for dividers
do {
    if (r4 * r2 === r5) {
        r0 += r4
    } else {
        r2 += 1
    }
    r2 += 1
} while (r2 <= r5)

 */

function main() {
	s = 0
	a = 10551381
	for (b = 1; b <= a; b += 1) {
		if (a % b === 0) {
            console.log(a, b)
			s += b
		}
	}

    console.log(s)
}

main()
