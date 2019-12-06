import { hasTwoSameAdjacentDigits, digitsNeverDecrease, hasAGroupOfOnly2 } from ".";
import { expect } from "chai";

describe("Day 4: Secure Container", secureSuite);

function secureSuite() {
	describe("hasTwoSameAdjacentDigits", hasTwoSameAdjacentDigitsSuite);
	describe("digitsNeverDecrease", digitsNeverDecreaseSuite);
	describe("hasAGroupOfOnly2", hasAGroupOfOnly2Suite);

	function hasTwoSameAdjacentDigitsSuite() {
		it("should return true for 111111", hasTwoSameAdjacentDigitsTest.bind(undefined, 111111, true));
		it("should return true for 223450", hasTwoSameAdjacentDigitsTest.bind(undefined, 223450, true));
		it(
			"should return true for 123789",
			hasTwoSameAdjacentDigitsTest.bind(undefined, 123789, false),
		);

		function hasTwoSameAdjacentDigitsTest(value: number, expectedResult: boolean) {
			const digits = `${value}`.split("").map((x) => +x);
			expect(hasTwoSameAdjacentDigits(digits)).to.eq(expectedResult);
		}
	}

	function digitsNeverDecreaseSuite() {
		it("should return true for 111111", digitsNeverDecreaseTest.bind(undefined, 111111, true));
		it("should return true for 223450", digitsNeverDecreaseTest.bind(undefined, 223450, false));
		it("should return true for 123789", digitsNeverDecreaseTest.bind(undefined, 123789, true));

		function digitsNeverDecreaseTest(value: number, expectedResult: boolean) {
			const digits = `${value}`.split("").map((x) => +x);
			expect(digitsNeverDecrease(digits)).to.eq(expectedResult);
		}
	}

	function hasAGroupOfOnly2Suite() {
		it("should return true for 111111", hasAGroupOfOnly2Test.bind(undefined, 111111, false));
		it("should return true for 223450", hasAGroupOfOnly2Test.bind(undefined, 223450, true));
		it("should return true for 123789", hasAGroupOfOnly2Test.bind(undefined, 123789, false));
		it("should return true for 111122", hasAGroupOfOnly2Test.bind(undefined, 111122, true));

		function hasAGroupOfOnly2Test(value: number, expectedResult: boolean) {
			const digits = `${value}`.split("").map((x) => +x);
			expect(hasAGroupOfOnly2(digits)).to.eq(expectedResult);
		}
	}
}
