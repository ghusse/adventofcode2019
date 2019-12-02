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

	const opCodes = resolveProgram(input);

	return [`${opCodes[0]}`];
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
