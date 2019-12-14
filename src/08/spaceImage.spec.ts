import { expect } from "chai";
import { resolve1 } from ".";

describe("Day 8: Space Image Format", spaceSuite);

function spaceSuite(): void {
	it("should return 1 in for the example", testResolve1.bind(null, "123456789012", 3, 2, 1));
}

function testResolve1(input: string, width: number, height: number, expectedResult: number) {
	expect(resolve1(input, width, height)).to.eq(expectedResult);
}
