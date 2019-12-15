import { executeFullProgram } from ".";
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
		const program: bigint[] = "1002,4,3,4,33".split(",").map((x) => BigInt(x));

		const result = executeFullProgram(program, [1n]);

		expect(result.opCodes).to.eql([1002n, 4n, 3n, 4n, 99n]);
	}

	function secondProgramTest() {
		const program: bigint[] = "1101,100,-1,4,0".split(",").map((x) => BigInt(x));

		const result = executeFullProgram(program, [1n]);

		expect(result.opCodes).to.eql([1101n, 100n, -1n, 4n, 99n]);
	}

	function thirdProgramTest() {
		const program: bigint[] = "3,9,8,9,10,9,4,9,99,-1,8".split(",").map((x) => BigInt(x));

		expect(executeFullProgram(program, [9n]).output[0]).to.eq(0n);
		expect(executeFullProgram(program, [8n]).output[0]).to.eq(1n);
		expect(executeFullProgram(program, [7n]).output[0]).to.eq(0n);
	}

	function fourthProgramTest() {
		const program: bigint[] = "3,9,7,9,10,9,4,9,99,-1,8".split(",").map((x) => BigInt(x));

		expect(executeFullProgram(program, [9n]).output[0]).to.eq(0n);
		expect(executeFullProgram(program, [8n]).output[0]).to.eq(0n);
		expect(executeFullProgram(program, [7n]).output[0]).to.eq(1n);
		expect(executeFullProgram(program, [6n]).output[0]).to.eq(1n);
	}

	function fifthProgramTest() {
		const program: bigint[] = "3,3,1108,-1,8,3,4,3,99".split(",").map((x) => BigInt(x));

		expect(executeFullProgram(program, [9n]).output[0]).to.eq(0n);
		expect(executeFullProgram(program, [8n]).output[0]).to.eq(1n);
		expect(executeFullProgram(program, [7n]).output[0]).to.eq(0n);
	}

	function sixthProgramTest() {
		const program: bigint[] = "3,3,1107,-1,8,3,4,3,99".split(",").map((x) => BigInt(x));

		expect(executeFullProgram(program, [9n]).output[0]).to.eq(0n);
		expect(executeFullProgram(program, [8n]).output[0]).to.eq(0n);
		expect(executeFullProgram(program, [7n]).output[0]).to.eq(1n);
		expect(executeFullProgram(program, [6n]).output[0]).to.eq(1n);
	}

	function jumpTest1() {
		const program: bigint[] = "3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9"
			.split(",")
			.map((x) => BigInt(x));

		expect(executeFullProgram(program, [0n]).output[0]).to.eq(0n);
		expect(executeFullProgram(program, [1n]).output[0]).to.eq(1n);
		expect(executeFullProgram(program, [-1n]).output[0]).to.eq(1n);
	}

	function jumpTest2() {
		const program: bigint[] = "3,3,1105,-1,9,1101,0,0,12,4,12,99,1"
			.split(",")
			.map((x) => BigInt(x));

		expect(executeFullProgram(program, [0n]).output[0]).to.eq(0n);
		expect(executeFullProgram(program, [1n]).output[0]).to.eq(1n);
		expect(executeFullProgram(program, [-1n]).output[0]).to.eq(1n);
	}

	function largerTest() {
		const program: bigint[] = `3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
                                1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
                                999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`
			.split(",")
			.map((x) => BigInt(x.trim()));

		expect(executeFullProgram(program, [7n]).output[0]).to.eq(999n);
		expect(executeFullProgram(program, [8n]).output[0]).to.eq(1000n);
		expect(executeFullProgram(program, [9n]).output[0]).to.eq(1001n);
	}
}
