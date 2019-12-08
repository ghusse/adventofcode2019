import { executeProgram } from "../05";
import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

const readFileAsync = promisify(readFile);

export async function run(): Promise<string[]> {
	const input: string = await readFileAsync(join(__dirname, "input.txt"), "utf8");

	return [`${resolve1(input)}`];
}

export function resolve1(input: string): number {
	const possiblePhaseSettings = generateCombinations([0, 1, 2, 3, 4]);
	const program = input.split(",").map((x) => +x);

	return possiblePhaseSettings
		.map((phaseSettings: number[]) => executeForPhaseSetting(program, phaseSettings))
		.reduce((x, y) => Math.max(x, y));
}

export function executeForPhaseSetting(program: number[], phaseSettings: number[]): number {
	return phaseSettings.reduce((output: number, phaseSetting: number): number => {
		const { output: result } = executeProgram(program, [phaseSetting, output]);

		if (result.length !== 1) {
			throw new Error("Invalid number of outputs");
		}

		return result[0];
	}, 0);
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
