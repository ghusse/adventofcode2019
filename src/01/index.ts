import { readFileSync } from "fs";
import { join } from "path";

export async function run(): Promise<string[]> {
	const masses: number[] = readFileSync(join(__dirname, "input.txt"), "utf8")
		.split("\n")
		.filter(Boolean)
		.map((line: string): number => +line);

	const response1 = masses.map(getFuelForMass).reduce((sum, fuel) => sum + fuel, 0);
	const response2 = masses.map(getFuelForMassAndFuel).reduce((sum, fuel) => sum + fuel, 0);

	return [`${response1}`, `${response2}`];
}

export function getFuelForMass(mass: number): number {
	return Math.max(0, Math.floor(mass / 3) - 2);
}

export function getFuelForMassAndFuel(mass: number): number {
	let massToPush: number = mass;
	let totalFuel: number = 0;

	while (massToPush > 0) {
		const fuel: number = getFuelForMass(massToPush);
		totalFuel += fuel;
		massToPush = fuel;
	}

	return totalFuel;
}
