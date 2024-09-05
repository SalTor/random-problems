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

export class MedicineInventory {
  private medicines: Map<string, number>;
  private maps: Map<string, string>;

  constructor() {
    this.medicines = new Map();
    this.maps = new Map();
  }

  get(medicine: string) {
    return this.medicines.get(medicine);
  }

  private add(medicine: string, units: number) {
    const current = this.medicines.get(medicine) || 0;
    this.medicines.set(medicine, current + units);
  }

  process(instructions: Array<string>) {
    const messages = [];

    const instr = instructions.map(parseInstruction);

    for (const instruction of instr) {
      if (instruction.action === "add") {
        this.add(instruction.medicine, instruction.units);
      }

      if (instruction.action === "fill") {
        const { name, fills } = instruction;

        for (const fill of fills) {
          if (fill.status) {
            messages.push(`Cannot fill for ${name}: ${fill.message}`);
          } else if (fill.medicine) {
            const { medicine, units, isGenericAcceptable } = fill;
            const current = this.medicines.get(medicine) || 0;

            if (current < units) {
              if (isGenericAcceptable) {
                const generic = this.maps.get(medicine);
                if (generic) {
                  const currentGeneric = this.medicines.get(generic) || 0;
                  if (currentGeneric < units) {
                    messages.push(
                      `Cannot fill for ${name}: Not enough units to satisfy request.`,
                    );
                  } else {
                    this.medicines.set(generic, currentGeneric - units);
                    messages.push(
                      `Can Fill for ${name}: ${units} of ${generic}.`,
                    );
                  }
                }
              } else {
                messages.push(
                  `Cannot fill for ${name}: Not enough units to satisfy request.`,
                );
              }
            } else {
              this.medicines.set(medicine, current - units);
              messages.push(`Can Fill for ${name}: ${units} of ${medicine}.`);
            }
          }
        }
      }

      if (instruction.action === "map") {
        const { from, to } = instruction;
        this.maps.set(from, to);
        this.maps.set(to, from);
        messages.push(`Mapping ${from} to ${to}`);
      }
    }

    return { messages };
  }
}

export function parseInstruction(instruction: string) {
  const actionIndex = instruction.indexOf("|");
  const action = instruction.slice(0, actionIndex);
  const details = instruction.slice(actionIndex + 1);

  if (action === "Add") {
    const [medicine, _units] = details.split("|");

    const units = unitsSchema.safeParse(_units);
    if (units.success) {
      return {
        action: "add" as const,
        medicine,
        units: units.data,
      };
    }
    return { status: "error", message: units.error.message };
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
        return { status: "error" as const, message: units.error.message };
      }

      if (!isGenericAcceptable.success) {
        return {
          status: "error" as const,
          message: isGenericAcceptable.error.message,
        };
      }

      return {
        medicine,
        units: units.data,
        isGenericAcceptable: isGenericAcceptable.data,
      };
    });
    return { action: "fill" as const, name, fills };
  }

  if (action === "Map") {
    const [med1, med2] = details.split("|");
    return {
      action: "map" as const,
      from: med1,
      to: med2,
    };
  }

  return { status: "error", message: "Unsupported instruction." };
}
