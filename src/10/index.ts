import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

const readFileAsync = promisify(readFile);

export async function run(): Promise<string[]> {
	const input: string = await readFileAsync(join(__dirname, "input.txt"), "utf8");
	const asteroids = parse(input);

	return [JSON.stringify(findBestAsteroid(asteroids))];
}

export function findBestAsteroid(asteroids: IAsteroid[]): { asteroid: IAsteroid; inSight: number } {
	return asteroids
		.map((asteroid) => ({
			asteroid,
			inSight: findNumberInSightOf(asteroid, asteroids),
		}))
		.reduce((best, candidate) => (best.inSight > candidate.inSight ? best : candidate));
}

export function parse(input: string): IAsteroid[] {
	return input
		.split("\n")
		.map(
			(line, y): IAsteroid[] =>
				line
					.trim()
					.split("")
					.map((char, x) => (char === "#" ? { x, y } : undefined))
					.filter(Boolean) as IAsteroid[],
		)
		.reduce((allAsteroids: IAsteroid[], lineAsteroids: IAsteroid[]): IAsteroid[] => {
			allAsteroids.push(...lineAsteroids);
			return allAsteroids;
		}, []);
}

export function findNumberInSightOf(asteroid: IAsteroid, allAsteroids: IAsteroid[]): number {
	const angles: Set<string> = allAsteroids
		.filter((oneAsteroid) => oneAsteroid.x !== asteroid.x || oneAsteroid.y !== asteroid.y)
		.reduce((accumulator: Set<string>, oneAsteroid: IAsteroid) => {
			const vector = { x: asteroid.x - oneAsteroid.x, y: asteroid.y - oneAsteroid.y };
			const divisor = Math.abs(gcd(vector.x, vector.y));
			const normalized = { x: vector.x / divisor, y: vector.y / divisor };

			accumulator.add(`${normalized.x},${normalized.y}`);

			return accumulator;
		}, new Set());

	return angles.size;
}

function gcd(a: number, b: number): number {
	if (a === 0) {
		return b;
	}

	if (b === 0) {
		return a;
	}

	return gcd(b, a % b);
}

export interface IAsteroid {
	x: number;
	y: number;
}
