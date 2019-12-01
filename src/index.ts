import program from "commander";
import { join } from "path";
import { Runner } from "./runner.interface";

program.version("1.0.0");

program.command("run <day>").action(run);

program.parse(process.argv);

async function run(day: string): Promise<void> {
	const dayNumber: number = +day;

	if (isNaN(dayNumber)) {
		throw new Error(`Invalid day number ${day}`);
	}

	const { run }: { run: Runner } = await import(
		join(__dirname, `${dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`}`, "index.ts")
	);

	(await run()).forEach((line: string) => console.info(line));
}
