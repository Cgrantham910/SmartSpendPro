document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("budget-form");
    const incomeInput = document.getElementById("income");
    const expensesInput = document.getElementById("expenses");
    const incomeResult = document.getElementById("income-result");
    const expensesResult = document.getElementById("expenses-result");
    const balanceResult = document.getElementById("balance-result");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const income = parseFloat(incomeInput.value) || 0;
        const expenses = parseFloat(expensesInput.value) || 0;

        const incomeFormatted = formatCurrency(income);
        const expensesFormatted = formatCurrency(expenses);
        const balance = income - expenses;
        const balanceFormatted = formatCurrency(balance);

        incomeResult.textContent = incomeFormatted;
        expensesResult.textContent = expensesFormatted;
        balanceResult.textContent = balanceFormatted;
    });

    function formatCurrency(amount) {
        return "$" + amount.toFixed(2);
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("budget-form");
    const incomeInput = document.getElementById("income");
    const expensesInput = document.getElementById("expenses");
    const categoryInput = document.getElementById("category");
    const dateInput = document.getElementById("expense-date");
    const incomeResult = document.getElementById("income-result");
    const expensesResult = document.getElementById("expenses-result");
    const balanceResult = document.getElementById("balance-result");
    const expenseList = document.getElementById("expense-list");

    const expenses = []; // Array to store expense details

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const income = parseFloat(incomeInput.value) || 0;
        const expenseAmount = parseFloat(expensesInput.value) || 0;
        const category = categoryInput.value;
        const expenseDate = dateInput.value;

        if (!category || !expenseDate) {
            alert("Please fill in both category and date for the expense.");
            return;
        }

        const expense = {
            amount: expenseAmount,
            category: category,
            date: expenseDate
        };

        expenses.push(expense); // Add the expense to the list

        const incomeFormatted = formatCurrency(income);
        const totalExpenses = calculateTotalExpenses(expenses);
        const expensesFormatted = formatCurrency(totalExpenses);
        const balance = income - totalExpenses;
        const balanceFormatted = formatCurrency(balance);

        incomeResult.textContent = incomeFormatted;
        expensesResult.textContent = expensesFormatted;
        balanceResult.textContent = balanceFormatted;

        // Update the expense list
        updateExpenseList(expenseList, expenses);

        // Clear input fields
        expensesInput.value = "";
        categoryInput.value = "";
        dateInput.value = "";
    });

    function formatCurrency(amount) {
        return "$" + amount.toFixed(2);
    }

    function calculateTotalExpenses(expenses) {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    function updateExpenseList(listElement, expenses) {
        listElement.innerHTML = ""; // Clear existing list

        expenses.forEach((expense, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `Expense ${index + 1}: ${formatCurrency(expense.amount)} (${expense.category}, ${expense.date})`;
            listElement.appendChild(listItem);
        });
    }
});
