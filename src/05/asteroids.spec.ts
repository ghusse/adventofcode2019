import { executeProgram } from ".";
import { expect } from "chai";

describe("Day 5: Sunny with a Chance of Asteroids", programSuite);

function programSuite() {
	it("should correctly execute 1002,4,3,4,33", firstProgramTest);
	it("should correctly execute 1101,100,-1,4,0", secondProgramTest);

	function firstProgramTest() {
		const program: number[] = "1002,4,3,4,33".split(",").map((x) => +x);

		const result = executeProgram(program, 1);

		expect(result.opCodes).to.eq([1002, 4, 3, 4, 99]);
	}

	function secondProgramTest() {
		const program: number[] = "1101,100,-1,4,0".split(",").map((x) => +x);

		const result = executeProgram(program, 1);

		expect(result.opCodes).to.eq([1101, 100, -1, 4, 99]);
	}
}
