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
        // clear previous visual errors
        val1El.classList.remove('input-error');
        val2El.classList.remove('input-error');

        // validate inputs
        const { valid, v1: n1, v2: n2, message, invalidEl } = validateInputs(val1El, val2El);
        if (!valid) {
            console.error(message);
            if (invalidEl) {
                invalidEl.classList.add('input-error');
                invalidEl.focus();
            }
            updateResult(message);
            return;
        }

        // perform calculation with safe error handling
        try {
            const res = calculate(op, n1, n2);

            // handle division-by-zero explicitly (divide returns null)
            if (res === null) {
                if (op === '4' && n2 === 0) {
                    val2El.classList.add('input-error');
                    updateResult('Error: division by zero');
                } else {
                    updateResult(null); // generic error
                }
                return;
            }

            updateResult(res);
        } catch (err) {
            console.error('Unexpected error during calculation', err);
            updateResult('Unexpected error');
        }
    });
});

/**
 * Validate and parse two input elements.
 * @param {HTMLInputElement} el1
 * @param {HTMLInputElement} el2
 * @returns {{valid:boolean, v1:number|null, v2:number|null, message:string, invalidEl:HTMLElement|null}}
 */
function validateInputs(el1, el2) {
    if (!el1 || !el2) {
        return { valid: false, v1: null, v2: null, message: 'Internal error: inputs not found', invalidEl: null };
    }

    const s1 = el1.value;
    const s2 = el2.value;

    if (s1.trim() === '') {
        return { valid: false, v1: null, v2: null, message: 'Please enter the first number', invalidEl: el1 };
    }
    if (s2.trim() === '') {
        return { valid: false, v1: null, v2: null, message: 'Please enter the second number', invalidEl: el2 };
    }

    const n1 = parseFloat(s1);
    const n2 = parseFloat(s2);

    if (!Number.isFinite(n1)) {
        return { valid: false, v1: null, v2: null, message: 'First value is not a valid number', invalidEl: el1 };
    }
    if (!Number.isFinite(n2)) {
        return { valid: false, v1: null, v2: null, message: 'Second value is not a valid number', invalidEl: el2 };
    }

    return { valid: true, v1: n1, v2: n2, message: '', invalidEl: null };
}

// clear error class on input
const val1El = document.getElementById('val1');
const val2El = document.getElementById('val2');
if (val1El) val1El.addEventListener('input', () => val1El.classList.remove('input-error'));
if (val2El) val2El.addEventListener('input', () => val2El.classList.remove('input-error'));


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