import { executeProgram, executeFullProgram } from "../05";
import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

const readFileAsync = promisify(readFile);

export async function run(): Promise<string[]> {
	const input: string = await readFileAsync(join(__dirname, "input.txt"), "utf8");

	return [`${resolve1(input)}`, `${resolve2(input)}`];
}

export function resolve1(input: string): bigint {
	const possiblePhaseSettings = generateCombinations([0n, 1n, 2n, 3n, 4n]);
	const program = input.split(",").map((x) => BigInt(x));

	return possiblePhaseSettings
		.map((phaseSettings: bigint[]) => executeForPhaseSetting(program, phaseSettings))
		.reduce((x, y) => (x > y ? x : y));
}

export function resolve2(input: string): bigint {
	const possiblePhaseSettings = generateCombinations([5n, 6n, 7n, 8n, 9n]);
	const program = input.split(",").map((x) => BigInt(x));

	return possiblePhaseSettings
		.map((phaseSettings: bigint[]) => executeInChainForPhaseSetting(program, phaseSettings))
		.reduce((x, y) => (x > y ? x : y));
}

export function executeForPhaseSetting(program: bigint[], phaseSettings: bigint[]): bigint {
	return phaseSettings.reduce((output: bigint, phaseSetting: bigint): bigint => {
		const { output: result } = executeFullProgram(program, [phaseSetting, output]);

		if (result.length !== 1) {
			throw new Error("Invalid number of outputs");
		}

		return result[0];
	}, 0n);
}

export function executeInChainForPhaseSetting(program: bigint[], phaseSetting: bigint[]): bigint {
	const programs: bigint[][] = phaseSetting.map(() => [...program]);
	const inputs: bigint[][] = phaseSetting.map((phase: bigint) => [phase]);
	const positions = phaseSetting.map(() => 0);

	let lastOutput: bigint | undefined;
	let index = 0;

	inputs[0].push(0n);

	do {
		const result = executeProgram(programs[index], positions[index], 0, inputs[index]);

		if (result.output === undefined) {
			break;
		}

		programs[index] = result.opCodes;
		positions[index] = result.nextPosition;
		inputs[(index + 1) % inputs.length].push(result.output);
		inputs[index] = result.remainingInputValues;
		lastOutput = result.output;
		index = (index + 1) % phaseSetting.length;
	} while (true);

	if (lastOutput === undefined) {
		throw new Error("The program did not run");
	}

	return lastOutput;
}

function generateCombinations(possibleValues: bigint[]): bigint[][] {
	if (possibleValues.length === 1) {
		return [possibleValues];
	}

	const result = [];
	for (let index = 0; index < possibleValues.length; index++) {
		const currentValue = possibleValues[index];
		const remainingValues = [...possibleValues];
		remainingValues.splice(index, 1);

		result.push(
			...generateCombinations(remainingValues).map((combination) => [currentValue, ...combination]),
		);
	}

	return result;
}
