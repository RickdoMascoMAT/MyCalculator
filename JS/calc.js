let result = 0;

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