export async function run() {
	const from = 246515;
	const to = 739105;

	return [
		`${resolve(from, to, [hasTwoSameAdjacentDigits, digitsNeverDecrease])}`,
		`${resolve(from, to, [digitsNeverDecrease, hasAGroupOfOnly2])}`,
	];
}

function resolve(from: number, to: number, criteria: Array<(digits: number[]) => boolean>): number {
	let meetingNumbers: number = 0;
	for (let candidate = from; candidate <= to; candidate++) {
		const digits: number[] = `${candidate}`.split("").map((x: string): number => +x);

		if (criteria.every((criterion) => criterion(digits))) {
			meetingNumbers++;
		}
	}

	return meetingNumbers;
}

export function hasTwoSameAdjacentDigits(digits: number[]): boolean {
	return digits.some((x, index, allDigits) => index > 0 && x === allDigits[index - 1]);
}

export function digitsNeverDecrease(digits: number[]): boolean {
	return digits.every((x, index, allDigits) => index === 0 || x >= allDigits[index - 1]);
}

export function hasAGroupOfOnly2(digits: number[]): boolean {
	return digits.some(
		(x, index, allDigits) =>
			index > 0 &&
			x === allDigits[index - 1] &&
			(index === 1 || allDigits[index - 2] !== x) &&
			(index === allDigits.length - 1 || allDigits[index + 1] !== x),
	);
}
