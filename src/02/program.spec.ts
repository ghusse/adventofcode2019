import { executeProgram } from ".";
import { expect } from "chai";

describe("Day 2: 1202 Program Alarm", alarmSuite);

function alarmSuite() {
	it(
		"should compute the right result for 1,0,0,0,99",
		testProgram.bind(undefined, "1,0,0,0,99", "2,0,0,0,99"),
	);
	it(
		"should compute the right result for 2,3,0,3,99",
		testProgram.bind(undefined, "2,3,0,3,99", "2,3,0,6,99"),
	);
	it(
		"should compute the right result for 2,4,4,5,99,0",
		testProgram.bind(undefined, "2,4,4,5,99,0", "2,4,4,5,99,9801"),
	);
	it(
		"should compute the right result for 1,1,1,4,99,5,6,0,99",
		testProgram.bind(undefined, "1,1,1,4,99,5,6,0,99", "30,1,1,4,2,5,6,0,99"),
	);
}

function testProgram(input: string, expectedOutput: string) {
	expect(executeProgram(input.split(",").map((x) => +x)).join(",")).to.equal(expectedOutput);
}
