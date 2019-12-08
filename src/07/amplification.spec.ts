import { expect } from "chai";
import { resolve1 } from ".";

describe("Day 7: Amplification Circuit", amplificationSuite);

function amplificationSuite() {
	it(
		"should return 43210 in the first example",
		testResolve1.bind(undefined, "3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0", 43210),
	);
	it(
		"should return 54321 in the second example",
		testResolve1.bind(
			undefined,
			"3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0",
			54321,
		),
	);
	it(
		"should return 65210 in the third example",
		testResolve1.bind(
			undefined,
			"3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0",
			65210,
		),
	);
}

function testResolve1(input: string, expectedResult: number) {
	expect(resolve1(input)).to.eq(expectedResult);
}
