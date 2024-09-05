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

describe("Has 100 inventory for Pepsid", () => {
  let inventory: MedicineInventory;
  beforeEach(() => {
    inventory = new MedicineInventory();
    inventory.process(["Add|Pepsid|100"]);
  });

  test("Filling for N+1 X does not work", () => {
    const result = inventory.process(["Fill|Sal|Pepsid,101"]);
    expect(result.messages).toHaveLength(1);
  });

  test("Filling for N X works", () => {
    const result = inventory.process(["Fill|Sal|Pepsid,100"]);
    expect(result.messages).toHaveLength(0);
  });
});

describe("Has 100 inventory for Pepsid and 200 inventory for Ativan", () => {
  let inventory: MedicineInventory;
  beforeEach(() => {
    inventory = new MedicineInventory();
    inventory.process(["Add|Pepsid|100"]);
  });

  describe("Define generic Pepsid for Attivan", () => {
    beforeEach(() => {
      inventory.process(["Map|Pepsid|Attivan"]);
    });

    test("Filling for 150 X and generic is acceptable", () => {
      //
    });

    test("Filling for 150 X and generic is not acceptable", () => {
      //
    });
  });
});
