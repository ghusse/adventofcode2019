import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
const readFileAsync = promisify(readFile);

if (require.main === module) {
	run()
		.then((result) => console.info(result))
		.catch((e) => {
			console.error(e);
			process.exitCode = 1;
		});
}

export async function run(): Promise<string[]> {
	const input: string = await readFileAsync(join(__dirname, "input.txt"), "utf8");

	const result1 = resolveProgram(input);
	const result2: { noun: number; verb: number } = findModifications(input, 19690720);

	return [`${result1[0]}`, `${100 * result2.noun + result2.verb}`];
}

function findModifications(input: string, expectedResult: number): { noun: number; verb: number } {
	const parsed: number[] = input.split(",").map(Number);

	for (let noun = 0; noun < 100; noun++) {
		for (let verb = 0; verb < 100; verb++) {
			const newInput = [...parsed];
			newInput[1] = noun;
			newInput[2] = verb;

			if (executeProgram(newInput)[0] === expectedResult) {
				return { noun, verb };
			}
		}
	}

	throw new Error("Result not found");
}

export function resolveProgram(input: string): number[] {
	const parsed: number[] = input.split(",").map(Number);

	parsed[1] = 12;
	parsed[2] = 2;

	return executeProgram(parsed);
}

export function executeProgram(input: number[]): number[] {
	const opCodes: number[] = [...input];

	let position: number = 0;

	while (position >= 0 && position < opCodes.length) {
		const instruction: number = opCodes[position];

		if (instruction === 99) {
			break;
		}

		const operand1: number = opCodes[opCodes[position + 1]];
		const operand2: number = opCodes[opCodes[position + 2]];
		const resultPosition: number = opCodes[position + 3];

		switch (instruction) {
			case 1:
				opCodes[resultPosition] = operand1 + operand2;
				break;
			case 2:
				opCodes[resultPosition] = operand1 * operand2;
				break;
			default:
				throw new Error("Unknown instruction");
		}

		position += 4;
	}

	return opCodes;
}
