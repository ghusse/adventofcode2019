import { executeProgram, executeFullProgram } from "../05";
import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

const readFileAsync = promisify(readFile);

export async function run(): Promise<string[]> {
	const input: string = await readFileAsync(join(__dirname, "input.txt"), "utf8");

	return [`${resolve1(input)}`, `${resolve2(input)}`];
}

export function resolve1(input: string): number {
	const possiblePhaseSettings = generateCombinations([0, 1, 2, 3, 4]);
	const program = input.split(",").map((x) => +x);

	return possiblePhaseSettings
		.map((phaseSettings: number[]) => executeForPhaseSetting(program, phaseSettings))
		.reduce((x, y) => Math.max(x, y));
}

export function resolve2(input: string): number {
	const possiblePhaseSettings = generateCombinations([5, 6, 7, 8, 9]);
	const program = input.split(",").map((x) => +x);

	return possiblePhaseSettings
		.map((phaseSettings: number[]) => executeInChainForPhaseSetting(program, phaseSettings))
		.reduce((x, y) => Math.max(x, y));
}

export function executeForPhaseSetting(program: number[], phaseSettings: number[]): number {
	return phaseSettings.reduce((output: number, phaseSetting: number): number => {
		const { output: result } = executeFullProgram(program, [phaseSetting, output]);

		if (result.length !== 1) {
			throw new Error("Invalid number of outputs");
		}

		return result[0];
	}, 0);
}

export function executeInChainForPhaseSetting(program: number[], phaseSetting: number[]): number {
	const programs = phaseSetting.map(() => [...program]);
	const inputs = phaseSetting.map((phase: number) => [phase]);
	const positions = phaseSetting.map(() => 0);

	let lastOutput: number | undefined;
	let index = 0;

	inputs[0].push(0);

	do {
		const result = executeProgram(programs[index], positions[index], inputs[index]);

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

function generateCombinations(possibleValues: number[]): number[][] {
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
