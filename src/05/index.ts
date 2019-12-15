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
	const instructions: bigint[] = input.split(",").map((x) => BigInt(x));

	const { output: output1 } = executeFullProgram(instructions, [1n]);
	const { output: output2 } = executeFullProgram(instructions, [5n]);

	checkOutput(output1);
	checkOutput(output2);

	return [`${output1[output1.length - 1]}`, `${output2[output2.length - 1]}`];
}

function checkOutput(values: bigint[]) {
	if (
		!values.every(
			(value: bigint, index: number, allValues: bigint[]) =>
				!value || index === allValues.length - 1,
		)
	) {
		throw new Error("Invalid check value");
	}
}

export function executeFullProgram(
	program: bigint[],
	inputValues: bigint[],
): { opCodes: bigint[]; output: bigint[] } {
	const output: bigint[] = [];
	let opCodes: bigint[] = program.map((x) => BigInt(x));
	let position: number = 0;
	let remainingInputValues: bigint[] = inputValues.map((x) => BigInt(x));
	let relativeBase: number = 0;

	do {
		let result = executeProgram(opCodes, position, relativeBase, remainingInputValues);
		remainingInputValues = result.remainingInputValues;
		opCodes = result.opCodes;
		position = result.nextPosition;
		relativeBase = result.relativeBase;

		if (result.output !== undefined) {
			output.push(result.output);
		} else {
			break;
		}
	} while (true);

	return { opCodes, output };
}

export function executeProgram(
	program: bigint[],
	startPosition: number,
	startRelativeBase: number,
	inputValues: bigint[],
): {
	opCodes: bigint[];
	output: bigint | undefined;
	nextPosition: number;
	relativeBase: number;
	remainingInputValues: bigint[];
} {
	const opCodes: bigint[] = [...program];
	const remainingInputValues: bigint[] = [...inputValues];

	let position: number = startPosition;
	let relativeBase: number = startRelativeBase;

	while (position >= 0 && position < opCodes.length) {
		const instruction: bigint = opCodes[position];
		const thirdParameterMode = instruction / 10000n;
		const secondParameterMode = instruction / 1000n - thirdParameterMode * 10n;
		const firstParametersMode =
			instruction / 100n - secondParameterMode * 10n - thirdParameterMode * 100n;
		const opCode: bigint =
			instruction -
			firstParametersMode * 100n -
			secondParameterMode * 1000n -
			thirdParameterMode * 10000n;

		if (opCode === 99n) {
			break;
		}

		switch (opCode) {
			case 1n: {
				const operand1: bigint = getValue(opCodes, position + 1, relativeBase, firstParametersMode);
				const operand2: bigint = getValue(opCodes, position + 2, relativeBase, secondParameterMode);

				writeTo(opCodes, operand1 + operand2, position + 3, relativeBase, thirdParameterMode);

				position += 4;
				break;
			}
			case 2n: {
				const operand1: bigint = getValue(opCodes, position + 1, relativeBase, firstParametersMode);
				const operand2: bigint = getValue(opCodes, position + 2, relativeBase, secondParameterMode);

				writeTo(opCodes, operand1 * operand2, position + 3, relativeBase, thirdParameterMode);

				position += 4;
				break;
			}
			case 3n: {
				if (!remainingInputValues.length) {
					throw new Error("Invalid number of inputs");
				}

				const input = remainingInputValues.shift();
				writeTo(opCodes, input!, position + 1, relativeBase, firstParametersMode);

				position += 2;
				break;
			}
			case 4n: {
				const resultPosition: bigint = getValue(
					opCodes,
					position + 1,
					relativeBase,
					firstParametersMode,
				);
				return {
					opCodes,
					output: resultPosition,
					nextPosition: position + 2,
					remainingInputValues,
					relativeBase,
				};
			}
			case 5n: {
				const firstParameter: bigint = getValue(
					opCodes,
					position + 1,
					relativeBase,
					firstParametersMode,
				);
				const secondParameter: bigint = getValue(
					opCodes,
					position + 2,
					relativeBase,
					secondParameterMode,
				);

				if (firstParameter) {
					position = Number(secondParameter);
				} else {
					position += 3;
				}

				break;
			}
			case 6n: {
				const firstParameter: bigint = getValue(
					opCodes,
					position + 1,
					relativeBase,
					firstParametersMode,
				);
				const secondParameter: bigint = getValue(
					opCodes,
					position + 2,
					relativeBase,
					secondParameterMode,
				);

				if (firstParameter === 0n) {
					position = Number(secondParameter);
				} else {
					position += 3;
				}

				break;
			}
			case 7n: {
				const firstParameter: bigint = getValue(
					opCodes,
					position + 1,
					relativeBase,
					firstParametersMode,
				);
				const secondParameter: bigint = getValue(
					opCodes,
					position + 2,
					relativeBase,
					secondParameterMode,
				);

				writeTo(
					opCodes,
					firstParameter < secondParameter ? 1n : 0n,
					position + 3,
					relativeBase,
					thirdParameterMode,
				);

				position += 4;

				break;
			}

			case 8n: {
				const firstParameter: bigint = getValue(
					opCodes,
					position + 1,
					relativeBase,
					firstParametersMode,
				);
				const secondParameter: bigint = getValue(
					opCodes,
					position + 2,
					relativeBase,
					secondParameterMode,
				);

				writeTo(
					opCodes,
					firstParameter === secondParameter ? 1n : 0n,
					position + 3,
					relativeBase,
					thirdParameterMode,
				);

				position += 4;

				break;
			}

			case 9n: {
				const firstParameter: bigint = getValue(
					opCodes,
					position + 1,
					relativeBase,
					firstParametersMode,
				);
				relativeBase += Number(firstParameter);
				position += 2;
				break;
			}
			default:
				throw new Error("Unknown instruction");
		}
	}

	return {
		opCodes,
		output: undefined,
		nextPosition: position,
		relativeBase,
		remainingInputValues,
	};
}

function getValue(opCodes: bigint[], position: number, relativeBase: number, mode: bigint): bigint {
	switch (mode) {
		case 0n:
			return opCodes[Number(opCodes[position])] || 0n;
		case 1n:
			return opCodes[position] || 0n;
		case 2n:
			return opCodes[Number(opCodes[position]) + relativeBase] || 0n;
		default:
			throw new Error(`Invalid mode ${mode}`);
	}
}

function writeTo(
	opCodes: bigint[],
	value: bigint,
	position: number,
	relativeBase: number,
	mode: bigint,
): void {
	switch (mode) {
		case 0n: {
			opCodes[Number(opCodes[position])] = value;
			break;
		}
		case 1n: {
			throw new Error("Cannot write in immediate mode");
		}
		case 2n: {
			opCodes[Number(opCodes[position]) + relativeBase] = value;
		}
	}
}
