import { z } from "zod";

const unitsSchema = z.preprocess(
  (a) => parseInt(a as string, 10),
  z.number().positive(),
);

export class MedicineInventory {
  private medicines: Map<string, number>;

  constructor() {
    this.medicines = new Map();
  }

  get(medicine: string) {
    return this.medicines.get(medicine);
  }

  private add(medicine: string, units: number) {
    const current = this.medicines.get(medicine) || 0;
    this.medicines.set(medicine, current + units);
  }

  private fill(medicine: string, units: number) {
    const current = this.medicines.get(medicine) || 0;

    if (current < units) {
      return {
        status: "error",
        message: "Not enough units to satisfy request.",
      };
    }

    this.medicines.set(medicine, current - units);
  }

  process(instructions: Array<string>) {
    const messages = [];

    const instr = instructions.map(parseInstruction);

    for (const instruction of instr) {
      if (instruction.action === "add") {
        this.add(instruction.medicine, instruction.units);
      }

      if (instruction.action === "fill") {
        for (const fill of instruction.fills) {
          if (fill.status) {
            messages.push(
              `Can't fill for ${instruction.name}: ${fill.message}`,
            );
            continue;
          }

          if (fill.medicine) {
            const response = this.fill(fill.medicine, fill.units);
            if (response?.status) {
              messages.push(
                `Can't fill for ${instruction.name}: ${response.message}`,
              );
            }
          }
        }
      }
    }

    return { messages };
  }
}

function parseInstruction(instruction: string) {
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
    return { status: "error", message: units.error.toString() };
  }

  if (action === "Fill") {
    const nameIndex = details.indexOf("|");
    const medsIndex = details.slice(nameIndex + 1).indexOf("|");
    const [name, _fills] = details.slice(medsIndex + 1).split("|");
    const fills = _fills.split("|").map((fill) => {
      const [medicine, _units] = fill.split(",");
      const units = unitsSchema.safeParse(_units);
      if (units.success) {
        return { medicine, units: units.data };
      }
      return { status: "error" as const, message: units.error.toString() };
    });
    return { action: "fill" as const, name, fills };
  }

  return { status: "error", message: "Unsupported instruction." };
}
