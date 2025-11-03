/**
 * Current calculation result (holds last computed value).
 * Type: number | null
 * - number: a valid numeric result
 * - null: indicates an error (for example division by zero)
 */
let result = 0;

import { add, subtract, multiply, divide } from './operations.js';
/**
 * Compute a result based on an operator id and two numeric values.
 * Operator ids are strings matching the `id` attribute of the operator buttons:
 * - '1' => add
 * - '2' => subtract
 * - '3' => multiply
 * - '4' => divide
 * @param {string} op - Operator id (see mapping above).
 * @param {number} val1 - First numeric operand.
 * @param {number} val2 - Second numeric operand.
 * @returns {number|null} Computed result, or `null` when an error occurs (invalid op or division by zero).
 * Side-effects: updates module-level `result` variable and logs errors to console.
 */
function calculate(op, val1, val2) {
    switch (op) {
        case '1':
            result = add(val1, val2);
            break;
        case '2':
            result = subtract(val1, val2);
            break;
        case '3':
            result = multiply(val1, val2);
            break;
        case '4':
            result = divide(val1, val2);
            break;
        default:
            console.error('Invalid operation');
            return null;
    }
    return result;
}

export { calculate , result };