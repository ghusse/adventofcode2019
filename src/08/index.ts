import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

const readFileAsync = promisify(readFile);

export async function run(): Promise<string[]> {
	const input: string = await readFileAsync(join(__dirname, "input.txt"), "utf8");

	return [`${resolve1(input, 25, 6)}`, `${resolve2(input, 25, 6)}`];
}

export function resolve1(input: string, width: number, height: number): number {
	const rawData = input.split("").map((x) => +x.trim());
	const countsByLayer: number[][] = [];

	for (let index = 0; index < rawData.length; index++) {
		const layer = Math.floor(index / (width * height));
		const digit = rawData[index];

		if (countsByLayer[layer] === undefined) {
			countsByLayer[layer] = new Array(10).fill(0);
		}

		countsByLayer[layer][digit] = (countsByLayer[layer][digit] || 0) + 1;
	}

	const minZeroLayer = countsByLayer.reduce((minLayer, candidate) =>
		minLayer[0] < candidate[0] ? minLayer : candidate,
	);

	return minZeroLayer[1] * minZeroLayer[2];
}

export function resolve2(input: string, width: number, height: number): string {
	const rawData = input.split("").map((x) => +x.trim());
	const image: Array<number | undefined>[] = new Array(height)
		.fill(undefined)
		.map(() => new Array(width).fill(undefined));

	for (let index = 0; index < input.length; index++) {
		const layer = Math.floor(index / (width * height));
		const digit = rawData[index];
		const x = (index - layer * width * height) % width;
		const y = Math.floor((index - layer * width * height) / width);

		if (digit !== 2 && image[y][x] === undefined) {
			image[y][x] = digit;
		}
	}

	return image.map((line) => line.map((x) => (x === 1 ? "▨" : " ")).join("")).join("\n");
}
