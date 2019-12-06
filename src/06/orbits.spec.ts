import { expect } from "chai";
import { countOrbits } from ".";

describe("Day 6: Universal Orbit Map", orbitsSuite);

function orbitsSuite() {
	it("should give the right result for the example", countTest);

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
}
