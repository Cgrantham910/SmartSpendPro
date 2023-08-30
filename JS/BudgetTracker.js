export default class BudgetTracker {
    constructor(querySelectorString) {
        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = BudgetTracker.html();

        this.root.querySelector(".new-entry").addEventListener("click", () => {
            this.onNewEntryBtnClick();
        });

        this.root.querySelector(".sort-date").addEventListener("click", () => {
            this.sortEntriesBy("date");
        });

        this.root.querySelector(".sort-amount").addEventListener("click", () => {
            this.sortEntriesBy("amount");
        });

        this.root.querySelector(".filter-type").addEventListener("change", () => {
            this.filterEntriesByType();
        });

        this.root.querySelector(".clear-all").addEventListener("click", () => {
            this.clearAllEntries();
        });


        // Load initial data from Local Storage
        this.load();
    }

    static html() {
        return `
        <table class="budget-tracker">
        <thead>
            <tr>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th></th>
            </tr>
        </thead>
        <tbody class="entries"> </tbody>
        <tbody>
            <tr>
                <td colspan="5" class="controls">
                    <button type="button" class="new-entry">New Entry</button>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5" class="summary">
                    <strong>Total:</strong>
                    <span class="total">$0.00</span>
                </td>
            </tr>
        </tfoot>
    </table>
        `;
    }

    static entryHtml() {
        return `
        <tr>
        <td>
            <input class="input input-date" type="date">
        </td>
        <td>
            <input class="input input-description" type="text" placeholder="Add description (e.g. wages, bills, etc.)">
        </td>
        <td>
            <select class="input input-type">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
            <select class="input input-category">
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
            </select>
        </td>
        <td>
            <input type="number" class="input input-amount">
        </td>
        <td>
            <button type="button" class="delete-entry">&#10005;</button>
        </td>
    </tr>
        `;
    }

    load() {
        const entries = JSON.parse(localStorage.getItem("budget-tracker-entries") || "[]");

        for (const entry of entries) {
            this.addEntry(entry);
        }

        this.updateSummary();
    }

    updateSummary() {
        const total = this.getEntryRows().reduce((total, row) => {
            const amount = row.querySelector(".input-amount").value;
            const isExpense = row.querySelector(".input-type").value == "expense";
            const modifier = isExpense ? -1 : 1;

            return total + (amount * modifier);
        }, 0);

        const totalFormatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(total);

        this.root.querySelector(".total").textContent = totalFormatted
    }

    save() {
        const data = this.getEntryRows().map(row => {
            return {
                date: row.querySelector(".input-date").value,
                description: row.querySelector(".input-description").value,
                type: row.querySelector(".input-type").value,
                category: row.querySelector(".input-category").value,
                amount: parseFloat(row.querySelector(".input-amount").value),
            }; 
        });
    
        localStorage.setItem("budget-tracker-entries", JSON.stringify(data));
        this.updateSummary();
    }
    

    addEntry(entry = {}) {
         this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());

         const row = this.root.querySelector(".entries tr:last-of-type");

         row.querySelector(".input-date").value = entry.date || new Date(). toISOString().replace(/T.*/, "");
         row.querySelector(".input-description").value = entry.description || "";
         row.querySelector(".input-type").value = entry.type || "income";
         row.querySelector(".input-amount").value = entry.amount || 0;
         row.querySelector(".delete-entry").addEventListener("click", e => {
             this.onDeleteEntryBtnClick(e);
         });

         row.querySelectorAll(".input").forEach(input => {
            input.addEventListener("change", () => this.save());
         })

         const categorySelect = this.addCategorySelect();
         categorySelect.value = entry.category || "other";
         row.querySelector(".input-category").appendChild(categorySelect);
    }


    editEntry(row) {
        const inputDescription = row.querySelector(".input-description");
        const inputAmount = row.querySelector(".input-amount");

        // Enable editing
        inputDescription.disabled = false;
        inputAmount.disabled = false;

        // Store original values
        const originalDescription = inputDescription.value;
        const originalAmount = inputAmount.value;

        // Focus on description input
        inputDescription.focus();

        // Disable editing on blur
        inputDescription.addEventListener("blur", () => {
            if (this.validateInput(row)) { // Validate the edited input
                this.save();
            } else {
                inputDescription.value = originalDescription;
                inputAmount.value = originalAmount;
            }
            inputDescription.disabled = true;
            inputAmount.disabled = true;
        });

        // Listen for Enter key press
        inputDescription.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                inputDescription.blur(); // Save on Enter
            }
        });

        // Disable editing on Enter key press
        inputAmount.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                inputDescription.blur();
            }
        });

        inputAmount.addEventListener("blur", () => {
            if (this.validateInput(row)) { // Validate the edited input
                this.save();
            } else {
                inputDescription.value = originalDescription;
                inputAmount.value = originalAmount;
            }
            inputDescription.disabled = true;
            inputAmount.disabled = true;
        });
    }


    validateInput(row) {
        const inputDescription = row.querySelector(".input-description");
        const inputAmount = row.querySelector(".input-amount");
        const errorDescription = row.querySelector(".error-description");
        const errorAmount = row.querySelector(".error-amount");
        let isValid = true;

        // Clear previous error messages
        errorDescription.textContent = "";
        errorAmount.textContent = "";

        const description = inputDescription.value.trim();
        const amount = parseFloat(inputAmount.value);

        if (description === "") {
            errorDescription.textContent = "Description is required";
            isValid = false;
        }

        if (isNaN(amount) || amount <= 0) {
            errorAmount.textContent = "Amount must be a positive number";
            isValid = false;
        }

        return isValid;
    }


    addCategorySelect() {
        const select = document.createElement("select");
        select.classList.add("input", "input-category");
    
        const categories = [
            { value: "food", label: "Food" },
            { value: "transportation", label: "Transportation" },
            { value: "entertainment", label: "Entertainment" },
            { value: "utilities", label: "Utilities" },
            { value: "other", label: "Other" }
        ];
    
        for (const category of categories) {
            const option = document.createElement("option");
            option.value = category.value;
            option.textContent = category.label;
            select.appendChild(option);
        }
    
        return select;
    }
    


    getEntryRows() {
        return Array.from(this.root.querySelectorAll(".entries tr"));
    }

    onNewEntryBtnClick() {
         this.addEntry();
    }

    onDeleteEntryBtnClick(e) {
         e.target.closest("tr").remove();
        this.save();
    }
    
}

