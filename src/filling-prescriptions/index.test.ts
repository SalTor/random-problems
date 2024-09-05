import { Pharmacy, parseInstruction } from ".";

beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

afterAll(() => {
  vi.resetAllMocks();
});

const logger = vi.fn();

afterEach(() => {
  logger.mockReset();
});

describe("Parsing instructions", () => {
  test("Add|Pepsid|100", () => {
    expect(parseInstruction("Add|Pepsid|100")).toStrictEqual({
      action: "add",
      medicine: "Pepsid",
      units: 100,
    });
  });

  test("Fill|Sal|Pepsid,100,T", () => {
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

  test("Map|Pepsid|Ativan", () => {
    expect(parseInstruction("Map|Pepsid|Ativan")).toStrictEqual({
      action: "map",
      from: "Pepsid",
      to: "Ativan",
    });
  });
});

describe("Pharmacy.process([...])", () => {
  let pharmacy: Pharmacy;
  beforeEach(() => {
    pharmacy = new Pharmacy(logger);
  });

  test("No commands - logs", () => {
    pharmacy.process([]);

    expect(logger).toHaveBeenCalledWith(
      "Parsed messages and left with non valid instructions.",
    );
  });

  test("Malformed commands - logs", () => {
    pharmacy.process(["Adr|Fze|100"]);

    expect(logger).toHaveBeenCalledWith(
      "Parsed messages and left with non valid instructions.",
    );
  });
});

describe("Instruction: Add", () => {
  test("Adding quantity for new medicine retains it", () => {
    const pharmacy = new Pharmacy(logger);
    pharmacy.process(["Add|Pepsid|100"]);
    expect(logger).toHaveBeenNthCalledWith(
      1,
      "Add 100 to Pepsid, quantity now 100.",
    );
    expect(pharmacy.get("Pepsid")).toEqual(100);
  });

  test("Adding quantity for existing medicine updates it", () => {
    const pharmacy = new Pharmacy(logger);
    pharmacy.process(["Add|Pepsid|100"]);
    expect(pharmacy.get("Pepsid")).toEqual(100);

    pharmacy.process(["Add|Pepsid|100"]);
    expect(pharmacy.get("Pepsid")).toEqual(200);
  });
});

describe("Instruction: Fill", () => {
  let pharmacy: Pharmacy;
  beforeEach(() => {
    pharmacy = new Pharmacy(logger);
    pharmacy.process(["Add|Pepsid|100"]);
  });

  test("Filling for 100 Pepsid works", () => {
    pharmacy.process(["Fill|Sal|Pepsid,100,F"]);
    expect(logger).toHaveBeenNthCalledWith(
      2,
      "Can Fill for Sal: 100 of Pepsid.",
    );
  });

  test("Filling for 101 Pepsid does not work", () => {
    pharmacy.process(["Fill|Sal|Pepsid,101,F"]);
    expect(logger).toHaveBeenNthCalledWith(
      2,
      "Cannot fill for Sal: Not enough units to satisfy request.",
    );
  });
});

describe("Instruction: Map", () => {
  let pharmacy: Pharmacy;
  beforeEach(() => {
    pharmacy = new Pharmacy(logger);
    pharmacy.process(["Map|Pepsid|Ativan"]);
    pharmacy.process(["Add|Pepsid|100", "Add|Ativan|200"]);
  });

  test("Filling for 150 Pepsid and generic is not acceptable, fails", () => {
    pharmacy.process(["Fill|Sal|Pepsid,150,F"]);
    expect(logger).toHaveBeenNthCalledWith(
      4,
      "Cannot fill for Sal: Not enough units to satisfy request.",
    );
  });

  test("Filling for 150 Pepsid and generic is acceptable, succeeds", () => {
    pharmacy.process(["Fill|Sal|Pepsid,150,T"]);
    expect(logger).toHaveBeenNthCalledWith(
      4,
      "Can Fill for Sal: 150 of Ativan.",
    );
  });
});
