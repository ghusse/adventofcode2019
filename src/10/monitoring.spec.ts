import { IAsteroid, parse, findNumberInSightOf, findBestAsteroid } from ".";
import { expect } from "chai";

describe("Day 10: Monitoring Station", monitoringSuite);

function monitoringSuite() {
	it(
		"should return the right numbers in sight for each asteroid of the first example",
		firstExampleTest,
	);

	it(
		"should return the right answer for the second example",
		testWithInput.bind(
			undefined,
			`......#.#.
       #..#.#....
       ..#######.
       .#.#.###..
       .#..#.....
       ..#....#.#
       #..#....#.
       .##.#..###
       ##...#..#.
       .#....####`,
			{ x: 5, y: 8 },
			33,
		),
	);

	it(
		"should return the right answer for the third example",
		testWithInput.bind(
			undefined,
			`#.#...#.#.
      .###....#.
      .#....#...
      ##.#.#.#.#
      ....#.#.#.
      .##..###.#
      ..#...##..
      ..##....##
      ......#...
      .####.###.`,
			{ x: 1, y: 2 },
			35,
		),
	);

	it(
		"should return the right answer for the fourth example",
		testWithInput.bind(
			undefined,
			`.#..#..###
        ####.###.#
        ....###.#.
        ..###.##.#
        ##.##.#.#.
        ....###..#
        ..#.#..#.#
        #..#.#.###
        .##...##.#
        .....#.#..`,
			{ x: 6, y: 3 },
			41,
		),
	);

	it(
		"should return the right answer for the fifth example",
		testWithInput.bind(
			undefined,
			`.#..##.###...#######
      ##.############..##.
      .#.######.########.#
      .###.#######.####.#.
      #####.##.#.##.###.##
      ..#####..#.#########
      ####################
      #.####....###.#.#.##
      ##.#################
      #####.##.###..####..
      ..######..##.#######
      ####.##.####...##..#
      .#####..#.######.###
      ##...#.##########...
      #.##########.#######
      .####.#.###.###.#.##
      ....##.##.###..#####
      .#.#.###########.###
      #.#.#.#####.####.###
      ###.##.####.##.#..##`,
			{ x: 11, y: 13 },
			210,
		),
	);

	function firstExampleTest() {
		const asteroids: IAsteroid[] = parse(
			`.#..#
       .....
       #####
       ....#
       ...##`,
		);

		expect(asteroids.length).to.eq(10);

		expect(findNumberInSightOf({ x: 1, y: 0 }, asteroids)).to.eq(7);
		expect(findNumberInSightOf({ x: 4, y: 0 }, asteroids)).to.eq(7);
		expect(findNumberInSightOf({ x: 0, y: 2 }, asteroids)).to.eq(6);
		expect(findNumberInSightOf({ x: 4, y: 2 }, asteroids)).to.eq(5);
		expect(findNumberInSightOf({ x: 3, y: 4 }, asteroids)).to.eq(8);
	}

	function testWithInput(input: string, expectedBest: IAsteroid, expectedInSight: number) {
		const asteroids: IAsteroid[] = parse(input);

		expect(findBestAsteroid(asteroids)).to.eql({
			asteroid: expectedBest,
			inSight: expectedInSight,
		});
	}
}
