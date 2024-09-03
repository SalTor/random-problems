/**
 * Example instructions:
 * Add|Pepsid|100
 * - Add 100 units of Pepsid to our inventory
 * Fill|Sal|Pepsid,100
 * - Fill a prescription of 100 units of Pepsid for Sal
 */
export function process(instructions: Array<string>) {
  for (const instruction of instructions) {
    const [action, ...details] = instruction.split("|");
    if (action === "Add") {
      // handle add
    }
    if (action === "Fill") {
      // handle fill
    }
  }
}
