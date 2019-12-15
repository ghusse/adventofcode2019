import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";
import { executeFullProgram } from "../05";

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

	const result1 = executeFullProgram(instructions, [1n]);
	const result2 = executeFullProgram(instructions, [2n]);

	return [`${result1.output.join(",")}`, `${result2.output.join(",")}`];
}
