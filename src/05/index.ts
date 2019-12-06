import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

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
	const instructions: number[] = input.split(",").map((x) => +x);

	const { output } = executeProgram(instructions, 1);

	return [`${output.find(Boolean)}`];
}

export function executeProgram(
	input: number[],
	inputValue: number,
): { opCodes: number[]; output: number[] } {
	const opCodes: number[] = [...input];

	let position: number = 0;
	const output: number[] = [];

	while (position >= 0 && position < opCodes.length) {
		const instruction: number = opCodes[position];
		const thirdParameterMode = Math.floor(instruction * 1e-4);
		const secondParameterMode = Math.floor(instruction * 1e-3) - thirdParameterMode * 10;
		const firstParametersMode =
			Math.floor(instruction * 1e-2) - secondParameterMode * 10 - thirdParameterMode * 100;
		const opCode =
			instruction -
			firstParametersMode * 100 -
			secondParameterMode * 1000 -
			thirdParameterMode * 10000;

		if (opCode === 99) {
			break;
		}

		switch (opCode) {
			case 1: {
				const resultPosition: number = opCodes[position + 3];
				const operand1: number = getValue(opCodes, position + 1, firstParametersMode);
				const operand2: number = getValue(opCodes, position + 2, secondParameterMode);
				opCodes[resultPosition] = operand1 + operand2;
				position += 4;
				break;
			}
			case 2: {
				const resultPosition: number = opCodes[position + 3];
				const operand1: number = getValue(opCodes, position + 1, firstParametersMode);
				const operand2: number = getValue(opCodes, position + 2, secondParameterMode);
				opCodes[resultPosition] = operand1 * operand2;
				position += 4;
				break;
			}
			case 3: {
				const resultPosition: number = opCodes[position + 1];
				opCodes[resultPosition] = inputValue;
				position += 2;
				break;
			}
			case 4: {
				const resultPosition: number = getValue(opCodes, position + 1, firstParametersMode);
				output.push(resultPosition);
				position += 2;
				break;
			}
			default:
				throw new Error("Unknown instruction");
		}
	}

	return { opCodes, output };
}

function getValue(opCodes: number[], position: number, mode: number): number {
	switch (mode) {
		case 0:
			return opCodes[opCodes[position]];
		case 1:
			return opCodes[position];
		default:
			throw new Error(`Invalid mode ${mode}`);
	}
}
