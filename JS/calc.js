/**
 * Current calculation result (holds last computed value).
 * Type: number | null
 * - number: a valid numeric result
 * - null: indicates an error (for example division by zero)
 */
let result = 0;

/**
 * Attach click handlers to operator buttons (buttons must have class="op").
 * When an operator is clicked the two inputs `#val1` and `#val2` are read,
 * validated and passed to `calculate`.
 * Side-effects:
 * - logs errors to the console for invalid input
 * - updates the UI by calling `updateResult`
 */
// select only operator buttons
const allbtns = document.querySelectorAll('.op');

allbtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        const op = event.currentTarget.id;
        const val1El = document.getElementById('val1');
        const val2El = document.getElementById('val2');
        const v1 = parseFloat(val1El.value);
        const v2 = parseFloat(val2El.value);

        if (Number.isNaN(v1) || Number.isNaN(v2)) {
            console.error('Both inputs must be numbers.');
            updateResult('Error: invalid input');
            return;
        }

        const res = calculate(op, v1, v2);
        updateResult(res);
    });
});


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

/**
 * Render the result in the page element with id `result`.
 * If the element is not present the function logs the value to console.
 * @param {number|string|null} res - Result to display. If `null` an error label is shown.
 * Behavior:
 * - when `res === null`: sets text to 'Error' and color to crimson
 * - when `res` is a string (used for validation messages): shows the string
 * - otherwise converts `res` to string and displays it with default color
 */
function updateResult(res) {
    const out = document.getElementById('result');
    if (!out) {
        console.log('Result:', res);
        return;
    }

    if (res === null) {
        out.textContent = 'Error';
        out.style.color = 'crimson';
    } else {
        out.textContent = String(res);
        out.style.color = '';
    }
}