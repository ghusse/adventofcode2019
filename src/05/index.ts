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

	const { output: output1 } = executeProgram(instructions, [1]);
	const { output: output2 } = executeProgram(instructions, [5]);

	checkOutput(output1);
	checkOutput(output2);

	return [`${output1[output1.length - 1]}`, `${output2[output2.length - 1]}`];
}

function checkOutput(values: number[]) {
	if (
		!values.every(
			(value: number, index: number, allValues: number[]) =>
				!value || index === allValues.length - 1,
		)
	) {
		throw new Error("Invalid check value");
	}
}

export function executeProgram(
	input: number[],
	inputValues: number[],
): { opCodes: number[]; output: number[] } {
	const opCodes: number[] = [...input];
	const inputValuesTemp: number[] = [...inputValues];

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
				const input = inputValuesTemp.shift();

				if (input === undefined) {
					throw new Error("Invalid number of inputs");
				}

				opCodes[resultPosition] = input;
				position += 2;
				break;
			}
			case 4: {
				const resultPosition: number = getValue(opCodes, position + 1, firstParametersMode);
				output.push(resultPosition);
				position += 2;
				break;
			}
			case 5: {
				const firstParameter: number = getValue(opCodes, position + 1, firstParametersMode);
				const secondParameter: number = getValue(opCodes, position + 2, secondParameterMode);

				if (firstParameter) {
					position = secondParameter;
				} else {
					position += 3;
				}

				break;
			}
			case 6: {
				const firstParameter: number = getValue(opCodes, position + 1, firstParametersMode);
				const secondParameter: number = getValue(opCodes, position + 2, secondParameterMode);

				if (firstParameter === 0) {
					position = secondParameter;
				} else {
					position += 3;
				}

				break;
			}
			case 7: {
				const firstParameter: number = getValue(opCodes, position + 1, firstParametersMode);
				const secondParameter: number = getValue(opCodes, position + 2, secondParameterMode);
				const resultPosition: number = opCodes[position + 3];

				opCodes[resultPosition] = firstParameter < secondParameter ? 1 : 0;

				position += 4;

				break;
			}

			case 8: {
				const firstParameter: number = getValue(opCodes, position + 1, firstParametersMode);
				const secondParameter: number = getValue(opCodes, position + 2, secondParameterMode);
				const resultPosition: number = opCodes[position + 3];

				opCodes[resultPosition] = firstParameter === secondParameter ? 1 : 0;

				position += 4;

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
