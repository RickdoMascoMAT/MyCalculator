/**
 * Add two numbers.
 * @param {number} a - First addend.
 * @param {number} b - Second addend.
 * @returns {number} Sum of `a` and `b`.
 */
function add(a, b) {
    return a + b;
}

/**
 * Subtract two numbers.
 * @param {number} a - Minuend.
 * @param {number} b - Subtrahend.
 * @returns {number} Result of `a - b`.
 */
function subtract(a, b) {
    return a - b;
}

/**
 * Multiply two numbers.
 * @param {number} a - First factor.
 * @param {number} b - Second factor.
 * @returns {number} Product of `a` and `b`.
 */
function multiply(a, b) {
    return a * b;
}

/**
 * Divide two numbers.
 * @param {number} a - Dividend.
 * @param {number} b - Divisor.
 * @returns {number|null} Quotient `a / b`, or `null` when division by zero is attempted.
 * Side-effect: logs an error to console if `b === 0`.
 */
function divide(a, b) {
    if (b === 0) {
        console.error('Division by zero is not allowed.');
        return null;
    }
    return a / b;
}


export { add, subtract, multiply, divide };