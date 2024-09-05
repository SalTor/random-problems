import { MedicineInventory } from ".";

describe("Adding inventory", () => {
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
  const inventory = new MedicineInventory();
  inventory.process(["Add|Pepsid|100"]);

  test("Filling for N+1 X does not work", () => {
    const result = inventory.process(["Fill|Sal|Pepsid,101"]);
    expect(result.messages).toHaveLength(1);
  });

  test("Filling for N X works", () => {
    const result = inventory.process(["Fill|Sal|Pepsid,100"]);
    expect(result.messages).toHaveLength(0);
  });
});

describe.skip("Define generic Y for X", () => {
  describe("Has inventory for 100 X and 200 Y", () => {
    test("Filling for 150 X and generic is acceptable", () => {
      //
    });

    test("Filling for 150 X and generic is not acceptable", () => {
      //
    });
  });
});
