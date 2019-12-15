import { expect } from "chai";
import { resolve1, resolve2, executeInChainForPhaseSetting } from ".";

describe("Day 7: Amplification Circuit", amplificationSuite);

function amplificationSuite() {
	describe("part1", part1Suite);
	describe("part2", part2Suite);

	function part1Suite() {
		it(
			"should return 43210 in the first example",
			testResolve1.bind(undefined, "3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0", 43210n),
		);
		it(
			"should return 54321 in the second example",
			testResolve1.bind(
				undefined,
				"3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0",
				54321n,
			),
		);
		it(
			"should return 65210 in the third example",
			testResolve1.bind(
				undefined,
				"3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0",
				65210n,
			),
		);
	}

	function part2Suite() {
		const firstExample =
			"3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5";

		const secondExample = `3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
        -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
        53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`;

		it(
			"should return 139629729 when executing the first example with the optimal phase settings",
			testExecute2.bind(undefined, firstExample, [9n, 8n, 7n, 6n, 5n], 139629729n),
		);
		it(
			"should return 139629729 in the first example",
			testResolve2.bind(undefined, firstExample, 139629729n),
		);

		it(
			"should return 18216 when executing the second example with the optimal phase settings",
			testExecute2.bind(undefined, secondExample, [9n, 7n, 8n, 5n, 6n], 18216n),
		);
		it(
			"should return 18216 in the second example",
			testResolve2.bind(undefined, secondExample, 18216n),
		);
	}
}

function testResolve1(input: string, expectedResult: bigint) {
	expect(resolve1(input)).to.eq(expectedResult);
}

function testExecute2(input: string, phaseSetting: bigint[], expectedResult: bigint) {
	const program = input.split(",").map((x) => BigInt(x.trim()));

	expect(executeInChainForPhaseSetting(program, phaseSetting)).to.eq(expectedResult);
}

function testResolve2(input: string, expectedResult: bigint) {
	expect(resolve2(input)).to.eq(expectedResult);
}
