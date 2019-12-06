import { promisify } from "util";
import { readFile } from "fs";
import { join } from "path";

const readFileAsync = promisify(readFile);

export async function run(): Promise<string[]> {
	const input = await readFileAsync(join(__dirname, "input.txt"), "utf8");

	return [`${countOrbits(input)}`];
}

export function countOrbits(input: string): number {
	const nodesByKey: Map<string, INode> = input
		.split("\n")
		.reduce((nodes: Map<string, INode>, line: string): Map<string, INode> => {
			const matches = /^([^)]+)\)([^)]+)/.exec(line);

			if (!matches) {
				throw new Error(`Unable to parse line ${line}`);
			}

			const parentKey: string = matches[1]!;
			const orbitingKey: string = matches[2]!;

			const parent: INode = nodes.get(parentKey) || { key: parentKey, orbits: 0, children: [] };
			const orbiting: INode = nodes.get(orbitingKey) || {
				key: orbitingKey,
				orbits: 0,
				children: [],
				parent: parentKey,
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

	propagateOrbitNumber(root, nodesByKey);

	return allNodes.map((node) => node.orbits).reduce((sum, orbits) => sum + orbits, 0);
}

function propagateOrbitNumber(root: INode, nodesByKey: Map<string, INode>) {
	for (let childKey of root.children) {
		const child = nodesByKey.get(childKey)!;

		child.orbits += root.orbits;

		propagateOrbitNumber(child, nodesByKey);
	}
}

interface INode {
	key: string;
	orbits: number;
	children: string[];
	parent?: string;
}
