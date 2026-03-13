import { sum } from "../common/utils/operators"

//Defines the name of the test that is being done
it("Should add both parameters and return the sum", () => {
    expect(sum(3,4)).toBe(7)
})