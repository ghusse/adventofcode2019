import { expect } from "chai";
import { executeFullProgram, executeProgram } from "../05";

describe("Day 9: Sensor Boost", sensorBoostSuite);

function sensorBoostSuite(): void {
	it(
		"should return a copy of itself in the first example",
		testExecute.bind(null, "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99", [
			109n,
			1n,
			204n,
			-1n,
			1001n,
			100n,
			1n,
			100n,
			1008n,
			100n,
			16n,
			101n,
			1006n,
			101n,
			0n,
			99n,
		]),
	);

	it("should output the value at address 1985", testSimple);

	it(
		"should return the large number",
		testExecute.bind(null, "104,1125899906842624,99", [1125899906842624n]),
	);

	it("should return a large number", testLargeNumber);

	function testSimple() {
		const program: bigint[] = new Array(1986).fill(0n);
		program[1985] = 42n;
		program[0] = 109n;
		program[1] = 19n;
		program[2] = 204n;
		program[3] = -34n;
		program[4] = 99n;

		const result = executeProgram(program, 0, 2000, []);

		expect(result.output).to.eql(42n);
	}

	function testExecute(program: string, expectedOutput: bigint[]) {
		const { output } = executeFullProgram(
			program.split(",").map((x) => BigInt(x)),
			[],
		);

		expect(output).to.eql(expectedOutput);
	}

	function testLargeNumber() {
		const { output } = executeFullProgram(
			"1102,34915192,34915192,7,4,7,99,0".split(",").map((x) => BigInt(x)),
			[],
		);

		expect(output.length).to.eq(1);
		expect(output[0] > 99999999999999n).to.eq(true);
	}
}
