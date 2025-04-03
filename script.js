window.onload = function(){ 

    let a = ''
    let b = ''
    let expressionResult = ''
    let selectedOperation = null

    outputElement = document.getElementById("result")
    
    digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')
    
    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            if ((digit != '.') || (digit == '.' && !a.includes(digit))) { 
                a += digit
            }
            outputElement.innerHTML = a
        } else {
            if ((digit != '.') || (digit == '.' && !b.includes(digit))) { 
                b += digit
                outputElement.innerHTML = b        
            }
        }
    }
    
    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML
            onDigitButtonClicked(digitValue)
        }
    });
    
    document.getElementById("btn_op_mult").onclick = function() { 
        if (a === '') return
        selectedOperation = 'x'
    }
    document.getElementById("btn_op_plus").onclick = function() { 
        if (a === '') return
        selectedOperation = '+'
    }
    document.getElementById("btn_op_minus").onclick = function() { 
        if (a === '') return
        selectedOperation = '-'
    }
    document.getElementById("btn_op_div").onclick = function() { 
        if (a === '') return
        selectedOperation = '/'
    }
    
    document.getElementById("btn_op_clear").onclick = function() { 
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        outputElement.innerHTML = 0
    }
    
    document.getElementById("btn_op_equal").onclick = function() { 
        if (a === '' || b === '' || !selectedOperation)
            return
            
        switch(selectedOperation) { 
            case 'x':
                expressionResult = (+a) * (+b)
                break;
            case '+':
                expressionResult = (+a) + (+b)
                break;
            case '-':
                expressionResult = (+a) - (+b)
                break;
            case '/':
                expressionResult = (+a) / (+b)
                break;
        }
        
        a = expressionResult.toString()
        b = ''
        selectedOperation = null
    
        outputElement.innerHTML = a
    }
    
    document.getElementById("btn_op_sqrt").onclick = function() {
        let a = prompt("Введите коэффициент a:");
        let b = prompt("Введите коэффициент b:");
        let c = prompt("Введите коэффициент c:");
        
        a = parseFloat(a);
        b = parseFloat(b);
        c = parseFloat(c);
        
        if (isNaN(a) || isNaN(b) || isNaN(c)) {
          alert("Некорректный ввод данных");
          return;
        }
        
        let discriminant = b * b - 4 * a * c;
        let result;
        if (discriminant > 0) {
          let x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          let x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          result = `x₁ = ${x1}, x₂ = ${x2}`;
        } else if (discriminant === 0) {
          let x = -b / (2 * a);
          result = `x = ${x}`;
        } else {
          result = "∅";
        }
        document.getElementById("result").innerHTML = result;
    };
     
};
