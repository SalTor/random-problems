import { MedicineInventory } from ".";

describe.only("Adding inventory", () => {
  test("Adding quantity for new medicine retains it", () => {
    const inventory = new MedicineInventory();
    inventory.process(["Add|Pepsid|100"]);
    expect(inventory.get("Pepsid")).toEqual(100);
  });

  test("Adding quantity for existing medicine updates it", () => {
    const inventory = new MedicineInventory();
    inventory.process(["Add|Pepsid|100"]);
    expect(inventory.get("Pepsid")).toEqual(100);
    inventory.process(["Add|Pepsid|100"]);
    expect(inventory.get("Pepsid")).toEqual(200);
  });
});

describe("Add inventory for N X", () => {
  test("Filling for N X works", () => {
    //
  });

  test("Filling for N+1 X does not work", () => {
    //
  });
});

describe("Define generic Y for X", () => {
  describe("Has inventory for 100 X and 200 Y", () => {
    test("Filling for 150 X and generic is acceptable", () => {
      //
    });

    test("Filling for 150 X and generic is not acceptable", () => {
      //
    });
  });
});
