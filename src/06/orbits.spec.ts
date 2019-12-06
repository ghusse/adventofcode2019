import { expect } from "chai";
import { countOrbits, findPathToSanta } from ".";

describe("Day 6: Universal Orbit Map", orbitsSuite);

function orbitsSuite() {
	it("should give the right number of orbits for the example", countTest);
	it("should give the right number of moves for the example", movesTest);

	function countTest() {
		const input: string = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;

		expect(countOrbits(input)).to.eq(42);
	}

	function movesTest() {
		const input: string = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`;

		expect(findPathToSanta(input)).to.eq(4);
	}
}
