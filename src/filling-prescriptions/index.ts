import { z } from "zod";

const unitsSchema = z.preprocess(
  (a) => parseInt(a as string, 10),
  z.number().positive(),
);

const boolSchema = z.preprocess((a) => {
  if (a === "F") return false;
  if (a === "T") return true;
  return null;
}, z.boolean());

type Logger = (...data: any[]) => void;

export class Pharmacy {
  private inventory: Map<string, number>;
  private maps: Map<string, string>;
  private logger: Logger;

  constructor(logger: Logger = console.debug) {
    this.inventory = new Map();
    this.maps = new Map();
    this.logger = logger;
  }

  get(medicine: string) {
    return this.inventory.get(medicine);
  }

  private add(instruction: AddInstruction) {
    const { medicine, units } = instruction;
    const current = this.inventory.get(medicine) || 0;
    this.inventory.set(medicine, current + units);
    this.logger(
      `Add ${units} to ${medicine}, quantity now ${this.inventory.get(medicine)}.`,
    );
  }

  private map(instruction: MapInstruction) {
    const { from, to } = instruction;
    this.maps.set(from, to);
    this.logger(`Mapping ${from} to ${to}`);
  }

  process(instructions: Array<string>) {
    const instr = instructions.map(parseInstruction).filter((i) => i !== null);

    for (const instruction of instr) {
      if (instruction.action === "add") {
        this.add(instruction);
      }

      if (instruction.action === "fill") {
        const { name, fills } = instruction;

        for (const fill of fills) {
          if (fill.medicine) {
            const { medicine, units, isGenericAcceptable } = fill;
            const current = this.inventory.get(medicine) || 0;

            if (current < units) {
              if (isGenericAcceptable) {
                const generic = this.maps.get(medicine);
                if (generic) {
                  const currentGeneric = this.inventory.get(generic) || 0;
                  if (currentGeneric < units) {
                    this.logger(
                      `Cannot fill for ${name}: Not enough units to satisfy request.`,
                    );
                  } else {
                    this.inventory.set(generic, currentGeneric - units);
                    this.logger(
                      `Can Fill for ${name}: ${units} of ${generic}.`,
                    );
                  }
                }
              } else {
                this.logger(
                  `Cannot fill for ${name}: Not enough units to satisfy request.`,
                );
              }
            } else {
              this.inventory.set(medicine, current - units);
              this.logger(`Can Fill for ${name}: ${units} of ${medicine}.`);
            }
          }
        }
      }

      if (instruction.action === "map") {
        this.map(instruction);
      }
    }
  }
}

type AddInstruction = {
  action: "add";
  medicine: string;
  units: number;
};

type FillInstruction = {
  action: "fill";
  name: string;
  fills: Array<{
    medicine: string;
    units: number;
    isGenericAcceptable: boolean;
  }>;
};

type MapInstruction = {
  action: "map";
  from: string;
  to: string;
};

type Instructions = AddInstruction | FillInstruction | MapInstruction;

export function parseInstruction(instruction: string): null | Instructions {
  const actionIndex = instruction.indexOf("|");
  const action = instruction.slice(0, actionIndex);
  const details = instruction.slice(actionIndex + 1);

  if (action === "Add") {
    const [medicine, _units] = details.split("|");

    const units = unitsSchema.safeParse(_units);

    if (units.success) {
      return {
        action: "add",
        medicine,
        units: units.data,
      } satisfies AddInstruction;
    }

    console.error(units.error.message);

    return null;
  }

  if (action === "Fill") {
    const nameIndex = details.indexOf("|");
    const medsIndex = details.slice(nameIndex + 1).indexOf("|");
    const [name, _fills] = details.slice(medsIndex + 1).split("|");

    const fills = _fills.split("|").map((fill) => {
      const [medicine, _units, _generic] = fill.split(",");

      const units = unitsSchema.safeParse(_units);

      const isGenericAcceptable = boolSchema.safeParse(_generic);

      if (!units.success) {
        console.info(units.error.message);
        return null;
      }

      if (!isGenericAcceptable.success) {
        console.info(isGenericAcceptable.error.message);
        return null;
      }

      return {
        medicine,
        units: units.data,
        isGenericAcceptable: isGenericAcceptable.data,
      };
    });

    return {
      action: "fill",
      name,
      fills: fills.filter((f) => f !== null),
    } satisfies FillInstruction;
  }

  if (action === "Map") {
    const [med1, med2] = details.split("|");
    return {
      action: "map",
      from: med1,
      to: med2,
    } satisfies MapInstruction;
  }

  console.error("Unsupported instruction.", { instruction });
  return null;
}
