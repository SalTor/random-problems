import { z } from "zod";

const unitsSchema = z.preprocess(
  (a) => parseInt(a as string, 10),
  z.number().positive(),
);

class MedicineInventory {
  medicines: Map<string, number>;

  constructor() {
    this.medicines = new Map();
  }

  add(medicine: string, units: number) {
    const current = this.medicines.get(medicine) || 0;
    this.medicines.set(medicine, current + units);
  }

  fill(medicine: string, units: number) {
    const current = this.medicines.get(medicine) || 0;
    if (current >= units) {
      this.medicines.set(medicine, current - units);
    } else {
      return {
        status: "error",
        message: "Not enough units to satisfy request.",
      };
    }
  }

  parseInstruction(instruction: string) {
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

    if (action === "fill") {
      const [name, _fills] = details.split("|");
      const fills = _fills.split("|").map((fill) => {
        const [medicine, _units] = fill.split("|");
        const units = unitsSchema.safeParse(_units);
        if (units.success) {
          return { medicine, units: units.data };
        }
        return { status: "error", message: units.error.toString() };
      });
      return { action: "fill" as const, name, fills };
    }

    return { status: "error", message: "Unsupported instruction." };
  }
}
/**
  process([
      "Add|Pepsid|100",
      "Add|Ativan|100",
      "Fill|Galen|Pepsid,100,T|Ativan,200,T",
      "Add|Ativan|100",
      "Fill|Galen|Pepsid,100,T|Ativan,200,T"
  ])

  Add 100 to Pepsid, quantity now 100.
  Add 100 to Ativan, quantity now 100.
  Can't fill for Galen: insufficient inventory. // enough Pepsid; but not Ativan
  Add 100 to Ativan, quantity now 200.
  Can Fill for Galen: 100 of Pepsid. 200 of Ativan.
*/
/**
 * Example instructions:
 * Add|Pepsid|100
 * - Add 100 units of Pepsid to our inventory
 * Fill|Sal|Pepsid,100
 * - Fill a prescription of 100 units of Pepsid for Sal
 */
export function process(instructions: Array<string>) {
  const thing = new MedicineInventory();

  const messages = [];

  for (const instruction of instructions.map(thing.parseInstruction)) {
    if (instruction.action === "add") {
      thing.add(instruction.medicine, instruction.units);
    }

    if (instruction.action === "fill") {
      for (const fill of instruction.fills) {
        if (fill.status) {
          messages.push(`Can't fill for ${instruction.name}: ${fill.status}`);
        } else if (fill.medicine) {
          const response = thing.fill(fill.medicine, fill.units);
          if (response?.status) {
            messages.push(
              `Can't fill for ${instruction.name}: ${response.message}`,
            );
          }
        }
      }
    }
  }

  return { messages, thing };
}
