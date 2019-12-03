import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

const readFileAsync = promisify(readFile);

export async function run(): Promise<string[]> {
	const input: string = await readFileAsync(join(__dirname, "input.txt"), "utf8");

	return [`${resolvePart1(input)}`];
}

interface IMovement {
	down: number;
	right: number;
}

export function resolvePart1(input: string): number {
	const wireDefinitions: IMovement[][] = input.split("\n").map((line: string): IMovement[] =>
		line.split(",").map(
			(movement: string): IMovement => {
				const parts = /([UDRL])([0-9]+)/.exec(movement);

				if (!parts) {
					throw new Error(`Unable to parse ${movement}`);
				}

				switch (parts[1]) {
					case "U":
						return { down: -parts[2], right: 0 };
					case "D":
						return { down: +parts[2], right: 0 };
					case "L":
						return { right: -parts[2], down: 0 };
					case "R":
						return { right: +parts[2], down: 0 };
					default:
						throw new Error(`Invalid movement ${movement}`);
				}
			},
		),
	);

	return computeDistance(wireDefinitions);
}

export function computeDistance(wireDefinitions: IMovement[][]): number {
	const wirePoints: Array<Set<string>> = wireDefinitions.map(computeAllPoints);
	const intersections = computeIntersections(wirePoints);

	return intersections
		.map((point: IPoint) => Math.abs(point.x) + Math.abs(point.y))
		.reduce((min, distance) => Math.min(min, distance));
}

interface IPoint {
	x: 0;
	y: 0;
}

function computeAllPoints(wireDefinition: IMovement[]): Set<string> {
	const result: Set<string> = new Set();

	let currentPoint = { x: 0, y: 0 };

	for (let movement of wireDefinition) {
		const dx = movement.right > 0 ? 1 : movement.right < 0 ? -1 : 0;
		const dy = movement.down > 0 ? 1 : movement.down < 0 ? -1 : 0;
		let remainingX = movement.right;
		let remainingY = movement.down;

		while (remainingX !== 0 || remainingY !== 0) {
			remainingX -= dx;
			remainingY -= dy;

			currentPoint = {
				x: currentPoint.x + dx,
				y: currentPoint.y + dy,
			};

			result.add(JSON.stringify(currentPoint));
		}
	}

	return result;
}

function computeIntersections(wirePoints: Array<Set<string>>): IPoint[] {
	const intersections: Set<string> = new Set();
	const allPoints: Set<string> = new Set();

	for (let wire of wirePoints) {
		for (let point of wire.values()) {
			if (allPoints.has(point)) {
				intersections.add(point);
			} else {
				allPoints.add(point);
			}
		}
	}

	return Array.from(intersections.values()).map((x) => JSON.parse(x));
}
