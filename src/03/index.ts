import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

const readFileAsync = promisify(readFile);

export async function run(): Promise<string[]> {
	const input: string = await readFileAsync(join(__dirname, "input.txt"), "utf8");

	return [`${resolvePart1(input)}`, `${resolvePart2(input)}`];
}

interface IMovement {
	down: number;
	right: number;
}

export function resolvePart1(input: string): number {
	const wireDefinitions: IMovement[][] = parse(input);

	return computeDistance(wireDefinitions);
}

export function resolvePart2(input: string): number {
	const wireDefinitions: IMovement[][] = parse(input);

	return computeMinSteps(wireDefinitions);
}

function parse(input: string): IMovement[][] {
	return input.split("\n").map((line: string): IMovement[] =>
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
}

export function computeDistance(wireDefinitions: IMovement[][]): number {
	const wirePoints: Array<Map<string, IPoint>> = wireDefinitions.map(computeAllPoints);
	const intersections = computeIntersections(wirePoints);

	return intersections
		.map((point: IPoint) => Math.abs(point.x) + Math.abs(point.y))
		.reduce((min, distance) => Math.min(min, distance));
}

function computeMinSteps(wireDefinitions: IMovement[][]): number {
	const wirePoints: Array<Map<string, IPoint>> = wireDefinitions.map(computeAllPoints);
	const intersections = computeIntersections(wirePoints);

	return intersections
		.map((point: IPoint) => point.steps)
		.reduce((min, steps) => Math.min(min, steps));
}

interface IPoint {
	x: number;
	y: number;
	steps: number;
}

function computeAllPoints(wireDefinition: IMovement[]): Map<string, IPoint> {
	const result: Map<string, IPoint> = new Map();

	let currentPoint = { x: 0, y: 0, steps: 0 };

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
				steps: currentPoint.steps + 1,
			};

			const key: string = JSON.stringify({ x: currentPoint.x, y: currentPoint.y });

			if (!result.has(key)) {
				result.set(key, currentPoint);
			}
		}
	}

	return result;
}

function computeIntersections(wirePoints: Array<Map<string, IPoint>>): IPoint[] {
	const intersections: Map<string, IPoint> = new Map();
	const allPoints: Map<string, IPoint> = new Map();

	for (let wire of wirePoints) {
		for (let point of wire.keys()) {
			if (allPoints.has(point)) {
				const first: IPoint = allPoints.get(point)!;
				const second: IPoint = wire.get(point)!;

				intersections.set(point, {
					x: first.x,
					y: first.y,
					steps: first.steps + second.steps,
				});
			} else {
				allPoints.set(point, wire.get(point)!);
			}
		}
	}

	return Array.from(intersections.values());
}
