import { expect } from "chai";
import { getFuelForMass, getFuelForMassAndFuel } from ".";

describe("01 The Tyranny of the Rocket Equation", day1Suite);

function day1Suite() {
	it("should return the correct value of fuel", fuelTest);
	it("should return the correct value of fuel for mass and fuel", fuelForMassAndFuelTest);

	function fuelTest() {
		expect(getFuelForMass(12)).to.equal(2);
		expect(getFuelForMass(14)).to.equal(2);
		expect(getFuelForMass(1969)).to.equal(654);
		expect(getFuelForMass(100756)).to.equal(33583);
	}

	function fuelForMassAndFuelTest() {
		expect(getFuelForMassAndFuel(12)).to.equal(2);
		expect(getFuelForMassAndFuel(14)).to.equal(2);
		expect(getFuelForMassAndFuel(1969)).to.equal(966);
		expect(getFuelForMassAndFuel(100756)).to.equal(50346);
	}
}
