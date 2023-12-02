// Resources:
// https://en.wikipedia.org/wiki/Shunting_yard_algorithm

$(() => {
  //global variables 
  var arrQuestion = [];
  var operatorStack = [];
  var topOfTheStack = '';
  var numberQueue = [];

  $(".col, .col-3, .col-6").on('click', function() {

    if ($(this).val() == "AC")
    {
      // clear the expression and calculator
      $("#question").val("");
      $("#error").text("");
      arrQuestion = [];
      operatorStack = [];
      topOfTheStack = '';
      numberQueue = [];
    }
    else if ($(this).val() == 'backspace') 
    {
      arrQuestion.pop();
      $("#question").val(convertArrToExpression(arrQuestion));
    }
    else if ($(this).val() == "=")
    {
      //convert the arr to a string expression
      let expression = convertArrToExpression(arrQuestion);
      console.log(expression);

      let errorMsg = validateExpression(expression);
      if (errorMsg != "")
      {
        $("#error").text(errorMsg);
      }
      else
      {
        //evaluate the expression
        let answer = postfixToAnswer(evaluateExpression(expression));
        $("#error").text("The answer is: " + answer);
      }
    }
    else if ($(this).val() == "x")
    {
      // push to the equation array
      arrQuestion.push("*");
      $("#question").val(convertArrToExpression(arrQuestion));
    }
    else if ($(this).val() == "÷")
    {
      // push to the equation array
      arrQuestion.push("/");
      console.log(arrQuestion);
      $("#question").val(convertArrToExpression(arrQuestion));
    }
    else if($(this).val() == "sin" || $(this).val() == "cos" || $(this).val() == "tan")
    {
      arrQuestion.push($(this).val());
      $("#question").val(convertArrToExpression(arrQuestion));
      console.log(arrQuestion);
    }
    else
    {
      // push to the equation array
      arrQuestion.push($(this).val());
      $("#question").val(convertArrToExpression(arrQuestion));
    }    
  }); // on click event

  //===========================HELPER FUNCTION===========================
  // work out the answer using the string expression (passed in as parameter)
  // Shunting yard algorithm - infix to postfix
  const evaluateExpression = (expr) => {

    let number = '';
    for (let k=0; k<expr.length; k++)
    {
      if (isNaN(expr[k])) // this is a operator - add to the stack
      {
        if (expr[k] == '(')
        {
          // push on operator stack
          operatorStack.push(expr[k]);
          topOfTheStack = expr[k];
        }
        else if (expr[k] == ')')
        {
          // look for the left parenthesis
          if (operatorStack.length !== 0)
          {
            console.log("CLOSING BRACKET");
            let top = operatorStack.pop();
            while (top!==undefined && top !== '(')
            {
              // pop from stack and add to the queue
              numberQueue.push(top);
              top = operatorStack.pop();              
            }

            topOfTheStack = operatorStack[operatorStack.length-1]; //*
            console.log("Top: " + top);
          }
        }
        else if (expr[k] == "s") // sin
        {
          operatorStack.push("sin");
          topOfTheStack = expr[k];
          k = k+2;
        }
        else if (expr[k] == "c") // cos
        {
          operatorStack.push("cos");
          topOfTheStack = expr[k];
          k = k+2;
        }
        else if (expr[k] == "t") // tan
        {
          operatorStack.push("tan");
          topOfTheStack = expr[k];
          k = k+2;
        }
        else if (topOfTheStack == '')
        {
          operatorStack.push(expr[k]);
          topOfTheStack = expr[k];
        }
        else
        {
          let op1 = expr[k];
          let op2 = topOfTheStack;
          console.log("Before the while loop: op: " + op1 + " op2 " + op2);
          // there is an operator o2 at the top of the operator stack which is not a left parenthesis AND (o2 has greater precedence than o1 OR (o1 and o2 have the same precedence)
          while ((op2 !== '(' ) && 
          (op2!==undefined && 
          ((op2 == '^' && (op2 == '*' || op2 == '/')) || ((op2 == '*' || op2 == '/') && (op1 == '+' || op1 == '-'))) || //greater precedence
          (((op1 == '*' || op1 == '/') && (op2 == '*' || op2 == '/')) || ((op1 == '+' || op1 == '-') && (op2 == '+' || op2 == '-')) || ((op1=='^')&&(op2=='^')))
          )) // same precedence
          {
            // pop o2 from stack into queue
            console.log('===============');
            console.log(numberQueue);
            console.log(operatorStack);
            console.log("op2: " + op2);

            op2 = operatorStack.pop();
            if (op2 !== undefined && op2 !== '(' )
            {
              numberQueue.push(op2);  
            }
            else if (op2 === '(')
            {
              operatorStack.push('(');
            }

            console.log("op2: " + op2);
            console.log(numberQueue);
            console.log(operatorStack);
            console.log('+++++++++++++++');
          }
          // push o1 into onto the stack
          operatorStack.push(op1);
          topOfTheStack = op1;  
        }        
      }
      else // this is a number - add to queue
      {        
        if (k+1 < expr.length && !isNaN(expr[k+1]))
        {
          number += expr[k];
        }
        else
        {
          number += expr[k];
          numberQueue.push(number);
          number = '';
        }
        
        console.log(operatorStack);
        console.log(numberQueue);
      }
    }

    // look at the stack and enqueue the remaining operators
    while (operatorStack.length !== 0)
    {
      let top = operatorStack.pop();
      numberQueue.push(top);
      
      //topOfTheStack = top;
      console.log("top: " + top);
      console.log(operatorStack);
    }

    topOfTheStack = '';
    console.log(operatorStack);
    console.log(numberQueue);

    return numberQueue;
  }

  //===========================HELPER FUNCTION===========================
  // convert postfix array into a answer
  const postfixToAnswer = (postFixArr) => {
    console.log("POSTFIX to ANSWER");
    let stack = [];
    let answer = 0;
    let op1, op2;
    for (let i=0; i<postFixArr.length; i++)
    {
      if (!isNaN(postFixArr[i]))
      {
        stack.push(postFixArr[i]);
      }
      else
      {
        console.log(stack + postFixArr[i]);
        if (postFixArr[i] == 'sin' || postFixArr[i] == 'cos' || postFixArr[i] == 'tan')
        {
          op2 = stack.pop();
          answer = calculate(op2, 0, postFixArr[i]);
          stack.push(answer);
        }
        else
        {
          op2 = stack.pop();
          op1 = stack.pop();
          console.log(op1 + " " + op2 + " " + postFixArr[i]);
          answer = calculate(op1, op2, postFixArr[i]);
          stack.push(answer);
          console.log(stack);
        }

      }
    }

    return stack[0];
  }

  //===========================HELPER FUNCTION===========================
  const calculate = (op1, op2, operator) => {
    let answer;
    switch (operator)
    {
      case '+':
        answer = Number(op1) + Number(op2);
        break;
      case '-':
        answer = Number(op1) - Number(op2);
        break;
      case '*':
        answer = Number(op1) * Number(op2);
        break;
      case '/':
        answer = Number(op1) / Number(op2);
        break;
      case '^':
        answer = Math.pow(Number(op1), Number(op2));
        break;
      case 'sin':
        answer = Math.sin(Number(op1) * (Math.PI / 180));
        break;
      case 'cos':
        answer = Math.cos(Number(op1) * (Math.PI / 180));
        break;
      case 'tan':
        answer = Math.tan(Number(op1) * (Math.PI / 180));
        break;
    }

    return answer;
  }

  //===========================HELPER FUNCTION===========================
  // convert array into expression
  const convertArrToExpression = (arr) => {
    let expr = "";

    if (arr && Array.isArray(arr)) {
      arr.forEach(element => {
        expr += element;
      });
    }

    return expr;
  }

  //===========================HELPER FUNCTION===========================
  // validate the expression using regex
  const validateExpression = (expr) => {
    let newExpr = expr.replace(/\(/g, '');
    newExpr = newExpr.replace(/\)/g, '');
    
    console.log(newExpr);

    let regex = /^(\d+[\+\-\*\/\^])*[\+\-\*\/]?\d+$/;
    return "";
    if (newExpr.search(regex) !== -1)
    {
      return "";
    }
    else
    {
      return "There is an error with your expression";
    }    
  }

})