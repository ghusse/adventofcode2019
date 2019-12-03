import { expect } from "chai";
import { resolvePart1 } from ".";

describe("Day 3: Crossed Wires", day3Suite);

function day3Suite() {
	it(
		"should return 6 with first input",
		distanceTest.bind(undefined, `R8,U5,L5,D3\nU7,R6,D4,L4`, 6),
	);

	it(
		"should return 159 with second input",
		distanceTest.bind(
			undefined,
			`R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83`,
			159,
		),
	);

	it(
		"should return 135 with third input",
		distanceTest.bind(
			undefined,
			`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7`,
			135,
		),
	);
}

function distanceTest(input: string, expectedResult: number) {
	expect(resolvePart1(input)).to.eq(expectedResult);
}
