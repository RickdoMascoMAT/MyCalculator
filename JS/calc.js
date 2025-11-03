import { calculate } from './math/calculate.js';

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
            // add successful calculation to log
            if (res !== null) {
                addLogEntry(n1, n2, op, opSymbol(op), res);
            }
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

/** Calculation log (UI + persistence) ****************************************/
const LOG_KEY = 'calcLog:v1';
let calcLog = [];

/**
 * Format an entry object into a DOM node and append to the list.
 * @param {{time:string, a:number, b:number, op:string, symbol:string, result:number}} entry
 */
function renderLogEntry(entry) {
    const ul = document.getElementById('calc-log');
    if (!ul) return;

    const li = document.createElement('li');
    li.className = 'log-entry';
    if (entry.id) li.dataset.id = entry.id;

    const left = document.createElement('div');
    left.className = 'entry-left';

    const time = document.createElement('div');
    time.className = 'entry-time';
    time.textContent = entry.time;

    const expr = document.createElement('div');
    expr.className = 'entry-expr';
    expr.textContent = `${entry.a} ${entry.symbol} ${entry.b} = ${entry.result}`;

    left.appendChild(time);
    left.appendChild(expr);

    li.appendChild(left);

    // actions (Load / Delete)
    const actions = document.createElement('div');
    actions.className = 'entry-actions';

    const loadBtn = document.createElement('button');
    loadBtn.type = 'button';
    loadBtn.className = 'btn-log-load';
    loadBtn.textContent = 'Load';
    loadBtn.addEventListener('click', () => loadEntryById(entry.id));

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn-log-delete';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteLogEntry(entry.id, li));

    actions.appendChild(loadBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);

    // append to the top
    ul.insertBefore(li, ul.firstChild);
}

/** Load log from localStorage and render it */
function loadLog() {
    try {
        const raw = localStorage.getItem(LOG_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return;
        // ensure each entry has an id (backwards-compatibility)
        calcLog = data.map((e, i) => ({ id: e.id || (Date.now() + i), ...e }));
        // render entries (oldest last) so we insert in order
        calcLog.forEach((e) => renderLogEntry(e));
    } catch (err) {
        console.error('Failed to load calc log', err);
    }
}

/** Save current log to localStorage */
function saveLog() {
    try {
        localStorage.setItem(LOG_KEY, JSON.stringify(calcLog));
    } catch (err) {
        console.error('Failed to save calc log', err);
    }
}

/** Add a new entry (also persists) */
function addLogEntry(a, b, op, symbol, result) {
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleString(),
        a,
        b,
        op,
        symbol,
        result,
    };
    calcLog.push(entry);
    saveLog();
    renderLogEntry(entry);
}

/** Clear log both in memory, UI and storage */
function clearLog() {
    calcLog = [];
    try { localStorage.removeItem(LOG_KEY); } catch (e) {}
    const ul = document.getElementById('calc-log');
    if (ul) ul.innerHTML = '';
}

// wire clear button
const clearBtn = document.getElementById('clear-log');
if (clearBtn) clearBtn.addEventListener('click', () => clearLog());

/** Delete a single entry by id and remove its DOM node (if provided) */
function deleteLogEntry(id, liNode) {
    calcLog = calcLog.filter((e) => e.id !== id);
    saveLog();
    if (liNode && liNode.parentNode) liNode.parentNode.removeChild(liNode);
    else {
        const ul = document.getElementById('calc-log');
        if (!ul) return;
        const el = ul.querySelector(`li[data-id="${id}"]`);
        if (el) el.remove();
    }
}

/** Load an entry into the inputs and perform the calculation (does not re-log)
 * @param {number} id
 */
function loadEntryById(id) {
    const entry = calcLog.find((e) => e.id === id);
    if (!entry) return;
    loadEntry(entry);
}

function loadEntry(entry) {
    const aEl = document.getElementById('val1');
    const bEl = document.getElementById('val2');
    if (!aEl || !bEl) return;
    aEl.value = entry.a;
    bEl.value = entry.b;
    // clear any error styles
    aEl.classList.remove('input-error');
    bEl.classList.remove('input-error');

    // perform calculation but do not add a new log entry (user re-used history)
    const res = calculate(entry.op, entry.a, entry.b);
    updateResult(res);
}

// map operator id to symbol for display
function opSymbol(op) {
    switch (op) {
        case '1': return '+';
        case '2': return '-';
        case '3': return '×';
        case '4': return '÷';
        default: return op;
    }
}

// initialize log on load
// load log immediately (script is included at end of body so DOM elements exist)
loadLog();

/** End calculation log *******************************************************/