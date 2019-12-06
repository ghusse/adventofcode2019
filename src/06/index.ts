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
	const input = await readFileAsync(join(__dirname, "input.txt"), "utf8");

	return [`${countOrbits(input)}`, `${findPathToSanta(input)}`];
}

export function countOrbits(input: string): number {
	const nodesByKey: Map<string, INode> = getNodesByKey(input);

	const allNodes = Array.from(nodesByKey.values());

	return allNodes.map((node) => node.orbits).reduce((sum, orbits) => sum + orbits, 0);
}

export function findPathToSanta(input: string): number {
	const nodesByKey: Map<string, INode> = getNodesByKey(input);

	let you = nodesByKey.get("YOU")!;
	let santa = nodesByKey.get("SAN")!;

	let moves: number = 0;
	while (you.parent !== santa.parent) {
		if (you.depth > santa.depth) {
			you = nodesByKey.get(you.parent!)!;
			moves++;
		} else if (you.depth < santa.depth) {
			santa = nodesByKey.get(santa.parent!)!;
			moves++;
		} else {
			you = nodesByKey.get(you.parent!)!;
			santa = nodesByKey.get(santa.parent!)!;
			moves += 2;
		}
	}

	return moves;
}

function getNodesByKey(input: string): Map<string, INode> {
	const nodesByKey = input.split("\n").reduce((nodes: Map<string, INode>, line: string): Map<
		string,
		INode
	> => {
		const matches = /^([^)]+)\)([^)]+)/.exec(line);

		if (!matches) {
			throw new Error(`Unable to parse line ${line}`);
		}

		const parentKey: string = matches[1]!;
		const orbitingKey: string = matches[2]!;

		const parent: INode = nodes.get(parentKey) || {
			key: parentKey,
			orbits: 0,
			children: [],
			depth: 0,
		};
		const orbiting: INode = nodes.get(orbitingKey) || {
			key: orbitingKey,
			orbits: 0,
			children: [],
			parent: parentKey,
			depth: 0,
		};

		orbiting.orbits++;

		parent.children.push(orbitingKey);
		orbiting.parent = parentKey;

		nodes.set(parentKey, parent);
		nodes.set(orbitingKey, orbiting);

		return nodes;
	}, new Map());

	const allNodes = Array.from(nodesByKey.values());

	const root = allNodes.find((candidate) => !candidate.parent);

	if (!root) {
		throw new Error("Root not found");
	}

	propagateOrbitNumberAndDepth(root, nodesByKey);

	return nodesByKey;
}

function propagateOrbitNumberAndDepth(root: INode, nodesByKey: Map<string, INode>) {
	for (let childKey of root.children) {
		const child = nodesByKey.get(childKey)!;

		child.orbits += root.orbits;
		child.depth = root.depth + 1;

		propagateOrbitNumberAndDepth(child, nodesByKey);
	}
}

interface INode {
	key: string;
	orbits: number;
	children: string[];
	parent?: string;
	depth: number;
}
