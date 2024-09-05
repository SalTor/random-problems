import { Pharmacy, parseInstruction } from ".";

describe("Parsing instructions", () => {
  test("Add", () => {
    expect(parseInstruction("Add|Pepsid|100")).toStrictEqual({
      action: "add",
      medicine: "Pepsid",
      units: 100,
    });
  });

  test("Fill", () => {
    expect(parseInstruction("Fill|Sal|Pepsid,100,T")).toStrictEqual({
      action: "fill",
      name: "Sal",
      fills: [
        {
          medicine: "Pepsid",
          units: 100,
          isGenericAcceptable: true,
        },
      ],
    });
  });

  test("Map", () => {
    expect(parseInstruction("Map|Pepsid|Ativan")).toStrictEqual({
      action: "map",
      from: "Pepsid",
      to: "Ativan",
    });
  });
});

describe("Adding inventory", () => {
  test("Adding quantity for new medicine retains it", () => {
    const inventory = new Pharmacy();
    const { messages } = inventory.process(["Add|Pepsid|100"]);
    expect(messages).toStrictEqual(["Add 100 to Pepsid, quantity now 100."]);
    expect(inventory.get("Pepsid")).toEqual(100);
  });

  test("Adding quantity for existing medicine updates it", () => {
    const inventory = new Pharmacy();
    inventory.process(["Add|Pepsid|100"]);
    expect(inventory.get("Pepsid")).toEqual(100);
    inventory.process(["Add|Pepsid|100"]);
    expect(inventory.get("Pepsid")).toEqual(200);
  });
});

describe("Has 100 inventory for Pepsid", () => {
  let inventory: Pharmacy;
  beforeEach(() => {
    inventory = new Pharmacy();
    inventory.process(["Add|Pepsid|100"]);
  });

  test("Filling for 100 Pepsid works", () => {
    const result = inventory.process(["Fill|Sal|Pepsid,100,F"]);
    expect(result.messages).toStrictEqual(["Can Fill for Sal: 100 of Pepsid."]);
  });

  test("Filling for 101 Pepsid does not work", () => {
    const result = inventory.process(["Fill|Sal|Pepsid,101,F"]);
    expect(result.messages).toStrictEqual([
      "Cannot fill for Sal: Not enough units to satisfy request.",
    ]);
  });
});

describe("Has 100 inventory for Pepsid and 200 inventory for Ativan", () => {
  let inventory: Pharmacy;
  beforeEach(() => {
    inventory = new Pharmacy();
    inventory.process(["Add|Pepsid|100", "Add|Ativan|200"]);
  });

  describe("Define generic Pepsid for Attivan", () => {
    beforeEach(() => {
      inventory.process(["Map|Pepsid|Ativan"]);
    });

    test("Filling for 150 Pepsid and generic is not acceptable, fails", () => {
      const result = inventory.process(["Fill|Sal|Pepsid,150,F"]);
      expect(result.messages).toEqual([
        "Cannot fill for Sal: Not enough units to satisfy request.",
      ]);
    });

    test("Filling for 150 Pepsid and generic is acceptable, succeeds", () => {
      const result = inventory.process(["Fill|Sal|Pepsid,150,T"]);
      expect(result.messages).toEqual(["Can Fill for Sal: 150 of Ativan."]);
    });
  });
});
