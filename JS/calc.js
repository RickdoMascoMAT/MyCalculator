let result = 0;

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


function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        console.error("Division by zero is not allowed.");
        return null;
    }
    return a / b;
}

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
            console.error("Invalid operation");
            return null;
    }
    return result;
}

// update the UI result element
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