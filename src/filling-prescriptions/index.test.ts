import { Pharmacy, parseInstruction } from ".";

beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

afterAll(() => {
  vi.resetAllMocks();
});

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

const logger = vi.fn();

afterEach(() => {
  logger.mockReset();
});

describe("Adding inventory", () => {
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

describe("Has 100 inventory for Pepsid", () => {
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

describe("Has 100 inventory for Pepsid and 200 inventory for Ativan", () => {
  let pharmacy: Pharmacy;
  beforeEach(() => {
    pharmacy = new Pharmacy(logger);
    pharmacy.process(["Add|Pepsid|100", "Add|Ativan|200"]);
  });

  describe("Define generic Pepsid for Attivan", () => {
    beforeEach(() => {
      pharmacy.process(["Map|Pepsid|Ativan"]);
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
});

describe("Process no commands", () => {
  let pharmacy: Pharmacy;
  beforeEach(() => {
    pharmacy = new Pharmacy(logger);
  });

  test("No commands", () => {
    pharmacy.process([]);

    expect(logger).toHaveBeenCalledWith(
      "Parsed messages and left with non valid instructions.",
    );
  });

  test("Malformed commands", () => {
    pharmacy.process(["Adr|Fze|100"]);

    expect(logger).toHaveBeenCalledWith(
      "Parsed messages and left with non valid instructions.",
    );
  });
});
