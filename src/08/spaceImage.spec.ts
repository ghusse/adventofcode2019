import { expect } from "chai";
import { resolve1, resolve2 } from ".";

describe("Day 8: Space Image Format", spaceSuite);

function spaceSuite(): void {
	it("should return 1 in for the example", testResolve1.bind(null, "123456789012", 3, 2, 1));
	it(
		"should return 01/10 in for the example",
		testResolve2.bind(null, "0222112222120000", 2, 2, " ▨\n▨ "),
	);
}

function testResolve1(input: string, width: number, height: number, expectedResult: number) {
	expect(resolve1(input, width, height)).to.eq(expectedResult);
}
function testResolve2(input: string, width: number, height: number, expectedResult: string) {
	expect(resolve2(input, width, height)).to.eq(expectedResult);
}
