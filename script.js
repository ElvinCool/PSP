window.onload = function () {
    let a = '';
    let b = '';
    let expressionResult = '';
    let selectedOperation = null;

    const outputElement = document.getElementById("result");
    const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');

    let solvingQuadratic = false;
    let coefStage = 0;
    let coefA = '', coefB = '', coefC = '';

    function onDigitButtonClicked(digit) {
        if (solvingQuadratic) {
            if ((digit !== '.') || (digit === '.' && !outputElement.textContent.includes('.'))) {
                if (outputElement.textContent === '0' || coefStageStart) {
                    outputElement.textContent = digit;
                    coefStageStart = false;
                } else {
                    outputElement.textContent += digit;
                }
            }
        } else {
            if (!selectedOperation) {
                if ((digit !== '.') || (digit === '.' && !a.includes(digit))) {
                    a += digit;
                }
                outputElement.innerHTML = a;
            } else {
                if ((digit !== '.') || (digit === '.' && !b.includes(digit))) {
                    b += digit;
                    outputElement.innerHTML = b;
                }
            }
        }
    }

    digitButtons.forEach(button => {
        button.onclick = function () {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        };
    });

    document.getElementById("btn_op_mult").onclick = () => { if (a !== '') selectedOperation = 'x'; };
    document.getElementById("btn_op_plus").onclick = () => { if (a !== '') selectedOperation = '+'; };
    document.getElementById("btn_op_minus").onclick = () => { if (a !== '') selectedOperation = '-'; };
    document.getElementById("btn_op_div").onclick = () => { if (a !== '') selectedOperation = '/'; };

    document.getElementById("btn_op_clear").onclick = function () {
        a = '';
        b = '';
        coefA = coefB = coefC = '';
        selectedOperation = '';
        expressionResult = '';
        solvingQuadratic = false;
        coefStage = 0;
        outputElement.innerHTML = '0';
    };

    function solveQuadratic(a, b, c) {
        const d = b * b - 4 * a * c;
        let result = `D=${d}`;
        
        if (d > 0) {
            const x1 = (-b + Math.sqrt(d)) / (2 * a);
            const x2 = (-b - Math.sqrt(d)) / (2 * a);
            result += `, x₁=${x1.toFixed(2)}, x₂=${x2.toFixed(2)}`;
        } else if (d === 0) {
            const x = -b / (2 * a);
            result += `, x=${x.toFixed(2)}`;
        } else {
            result += ", корней нет";
        }

        return result;
    }

    document.getElementById("btn_op_equal").onclick = function () {
        if (solvingQuadratic) {
            const value = outputElement.textContent.trim();
            if (coefStage === 0) {
                coefA = value;
                coefStage = 1;
                outputElement.textContent = '0';
            } else if (coefStage === 1) {
                coefB = value;
                coefStage = 2;
                outputElement.textContent = '0';
            } else if (coefStage === 2) {
                coefC = value;

                const aVal = parseFloat(coefA);
                const bVal = parseFloat(coefB);
                const cVal = parseFloat(coefC);

                if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal)) {
                    outputElement.textContent = "Ошибка ввода";
                    return;
                }

                const res = solveQuadratic(aVal, bVal, cVal);
                outputElement.textContent = res;

                solvingQuadratic = false;
                coefStage = 0;
            }
        } else {
            if (a === '' || b === '' || !selectedOperation) return;

            switch (selectedOperation) {
                case 'x': expressionResult = (+a) * (+b); break;
                case '+': expressionResult = (+a) + (+b); break;
                case '-': expressionResult = (+a) - (+b); break;
                case '/': expressionResult = (+a) / (+b); break;
            }

            a = expressionResult.toString();
            b = '';
            selectedOperation = null;
            outputElement.innerHTML = a;
        }
    };

    document.getElementById("btn_op_negate").onclick = function () {
        if (solvingQuadratic) {
            let currentValue = outputElement.textContent;
            if (currentValue === '0') return;
    
            if (currentValue.startsWith('-')) {
                outputElement.textContent = currentValue.slice(1);
            } else {
                outputElement.textContent = '-' + currentValue;
            }
        } else {
            if (!selectedOperation) {
                if (a) {
                    if (a.startsWith('-')) {
                        a = a.slice(1);
                    } else {
                        a = '-' + a;
                    }
                    outputElement.textContent = a;
                }
            } else {
                if (b) {
                    if (b.startsWith('-')) {
                        b = b.slice(1);
                    } else {
                        b = '-' + b;
                    }
                    outputElement.textContent = b;
                }
            }
        }
    };
    
    document.getElementById("btn_op_sqrt").onclick = function () {
        solvingQuadratic = true;
        coefStage = 0;
        coefA = coefB = coefC = '';
        outputElement.textContent = '0';
    };
};