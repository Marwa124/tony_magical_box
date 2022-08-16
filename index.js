const validBills = [1, 5, 10, 20, 50, 100];
const operationCount = document.getElementById("operations_count");
const enteredBillInput = document.getElementById("entered_bill");
const expelledBillInput = document.getElementById("expelled_bill");
const errorMessage = document.querySelector('.error-message');
const errorUnique = document.querySelector('.error-unique');
const addBtn = document.getElementById("add");
const retrieveBtn = document.getElementById("retrieve");
const newOperationBtn = document.getElementById("new_operation");
const print = document.getElementById("print_result");

var enteredBillIArray = [];
var expelledBillIArray = [];
var operationLettersArray = [];

const file = document.createElement('a');

// Validate the inserted input number
operationCount.addEventListener("keyup", function(event) {
    let intOperationCount = Number(operationCount.value);
    errorMessage.hidden = true; // Hide an error msg by default

    // Operation number also must be an even number
    if (intOperationCount == 0 || intOperationCount >= 500 || (operationCount.value % 2) ) {
        addBtn.disabled = true;
        retrieveBtn.disabled = true;

        errorMessage.removeAttribute('hidden');
        return false;
    }

    enteredBillInput.disabled = false; // Disable input;
    expelledBillInput.disabled = false; // Disable input;
    addBtn.disabled = false;

    newOperationBtn.disabled = true;
    print.disabled = true;
})
// End Validate the inserted input number


// Compose Valid bills into an array
addBtn.addEventListener('click', function (e) {
    let result = helper(enteredBillIArray, enteredBillInput, errorUnique, e);

    if (enteredBillIArray.length >= Number(operationCount.value) / 2) {
        addBtn.disabled = true;
        enteredBillInput.disabled = true;
        retrieveBtn.disabled = false;
        expelledBillInput.focus()
    }

})
// End Compose Valid bills into an array


// Compose Expelled bills into an array
retrieveBtn.addEventListener('click', function (e) {
    let result = helper(expelledBillIArray, expelledBillInput, errorUnique, e);
    // Disable the btn when the half number of operations ends
    if (result.length >= Number(operationCount.value) / 2) {
        retrieveBtn.disabled = true;
        expelledBillInput.disabled = true; // Disable input;
        
        newOperationBtn.disabled = false;
        print.disabled = false;

        arrayComparison();
    }

})
// End Compose Expelled bills into an array

/**
 * @param {Array} array 
 * @param {string} input
 * @param {string} msgError
 * @param {any} event
 */
function helper(array, input, msgError, event) {
    event.preventDefault(); // Prevent the default action
    msgError.hidden = true; // Hide an error msg by default
    errorMessage.hidden = true; // Hide an error msg by default
    operationCount.disabled = true; // Disable input;

    // check length of entered bills to be half the numbers of operation specified
    let checkValidBill = validBills.find(function(elem) {
        let convertInputToInt = Number(input.value);
        return elem === convertInputToInt ? elem : '';
    });

    // Also check unique array values
    let uniqueElem = false;
    if (array.length > 0) {
        uniqueElem = array.includes(Number(input.value));
    }

    if (!checkValidBill) {
        errorMessage.removeAttribute('hidden');
    }

    if (checkValidBill && !uniqueElem) {
        array.push(checkValidBill)
    }

    if(uniqueElem){
        msgError.removeAttribute('hidden');
    }

    input.value = '';
    input.focus()
    return array;
}

async function arrayComparison() {
    // Queue data structure
    let queue = await isEqual(enteredBillIArray, expelledBillIArray);
    // Stack data structure
    let stack = await isEqual(enteredBillIArray, expelledBillIArray.reverse());
    // Priority queue data structure
    let priorityQueue = enteredBillIArray.every(elem => expelledBillIArray.includes(elem));
    if (queue) {
        operationLettersArray.push('q')
    }else if (stack) {
        operationLettersArray.push('s')
    }else if (priorityQueue && enteredBillIArray.length == expelledBillIArray.length) {
        operationLettersArray.push('p')
    }else {
        operationLettersArray.push('!')
    }
    // console.log(queue, stack, priorityQueue);
}

let isEqual = (a, b) => {return a.join() == b.join()};


// New Operation
newOperationBtn.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default action
    operationCount.disabled = false; // Disable input;
    operationCount.value = '';
    operationCount.focus();
    enteredBillIArray = [];
    expelledBillIArray = [];
})

// print
print.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default action
    // Stringify the array and add a new line after each element
    let printedResult = operationLettersArray.toString(operationLettersArray).replaceAll(',', "\n");

    file.href = "data:application/octet-stream,"+encodeURIComponent(printedResult);
    file.download = 'Results.txt';
    file.click();
})