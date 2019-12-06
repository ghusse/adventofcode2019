import { executeProgram } from ".";
import { expect } from "chai";

describe("Day 5: Sunny with a Chance of Asteroids", programSuite);

function programSuite() {
	it("should correctly execute 1002,4,3,4,33", firstProgramTest);
	it("should correctly execute 1101,100,-1,4,0", secondProgramTest);
	it("should correctly execute 3,9,8,9,10,9,4,9,99,-1,8", thirdProgramTest);
	it("should correctly execute 3,9,7,9,10,9,4,9,99,-1,8", fourthProgramTest);
	it("should correctly execute 3,3,1108,-1,8,3,4,3,99", fifthProgramTest);
	it("should correctly execute 3,3,1107,-1,8,3,4,3,99", sixthProgramTest);
	it("should correctly execute 3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9", jumpTest1);
	it("should correctly execute 3,3,1105,-1,9,1101,0,0,12,4,12,99,1", jumpTest2);
	it("should correctly execute the larger example", largerTest);

	function firstProgramTest() {
		const program: number[] = "1002,4,3,4,33".split(",").map((x) => +x);

		const result = executeProgram(program, 1);

		expect(result.opCodes).to.eql([1002, 4, 3, 4, 99]);
	}

	function secondProgramTest() {
		const program: number[] = "1101,100,-1,4,0".split(",").map((x) => +x);

		const result = executeProgram(program, 1);

		expect(result.opCodes).to.eql([1101, 100, -1, 4, 99]);
	}

	function thirdProgramTest() {
		const program: number[] = "3,9,8,9,10,9,4,9,99,-1,8".split(",").map((x) => +x);

		expect(executeProgram(program, 9).output[0]).to.eq(0);
		expect(executeProgram(program, 8).output[0]).to.eq(1);
		expect(executeProgram(program, 7).output[0]).to.eq(0);
	}

	function fourthProgramTest() {
		const program: number[] = "3,9,7,9,10,9,4,9,99,-1,8".split(",").map((x) => +x);

		expect(executeProgram(program, 9).output[0]).to.eq(0);
		expect(executeProgram(program, 8).output[0]).to.eq(0);
		expect(executeProgram(program, 7).output[0]).to.eq(1);
		expect(executeProgram(program, 6).output[0]).to.eq(1);
	}

	function fifthProgramTest() {
		const program: number[] = "3,3,1108,-1,8,3,4,3,99".split(",").map((x) => +x);

		expect(executeProgram(program, 9).output[0]).to.eq(0);
		expect(executeProgram(program, 8).output[0]).to.eq(1);
		expect(executeProgram(program, 7).output[0]).to.eq(0);
	}

	function sixthProgramTest() {
		const program: number[] = "3,3,1107,-1,8,3,4,3,99".split(",").map((x) => +x);

		expect(executeProgram(program, 9).output[0]).to.eq(0);
		expect(executeProgram(program, 8).output[0]).to.eq(0);
		expect(executeProgram(program, 7).output[0]).to.eq(1);
		expect(executeProgram(program, 6).output[0]).to.eq(1);
	}

	function jumpTest1() {
		const program: number[] = "3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9".split(",").map((x) => +x);

		expect(executeProgram(program, 0).output[0]).to.eq(0);
		expect(executeProgram(program, 1).output[0]).to.eq(1);
		expect(executeProgram(program, -1).output[0]).to.eq(1);
	}

	function jumpTest2() {
		const program: number[] = "3,3,1105,-1,9,1101,0,0,12,4,12,99,1".split(",").map((x) => +x);

		expect(executeProgram(program, 0).output[0]).to.eq(0);
		expect(executeProgram(program, 1).output[0]).to.eq(1);
		expect(executeProgram(program, -1).output[0]).to.eq(1);
	}

	function largerTest() {
		const program: number[] = `3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
                                1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
                                999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`
			.split(",")
			.map((x) => +x.trim());

		expect(executeProgram(program, 7).output[0]).to.eq(999);
		expect(executeProgram(program, 8).output[0]).to.eq(1000);
		expect(executeProgram(program, 9).output[0]).to.eq(1001);
	}
}
