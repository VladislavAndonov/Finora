import { html } from 'https://esm.run/lit-html@1';


export const transactionForm = (onSubmit, errMessage, transaction) => {
    console.log(transaction);

    return html`<div class="transaction-layout" style="color: #fff">
                <form class="transaction-form" @submit=${onSubmit}>

                    <fieldset>
                        <label for="title">Title</label>
                        <input type="text" name="title" id="title" required value=${transaction ? transaction.title : ""}>
                    </fieldset>

                    <fieldset>
                        <label for="type">Type</label>
                        <input type="radio" name="type" .checked=${transaction && transaction.type === "expenses"} id="expenses" value="expenses">
                        <label for="expenses">Expenses</label>
                        <input type="radio" name="type" .checked=${transaction && transaction.type === "income"} id="income" value="income">
                        <label for="income">Income</label>
                    </fieldset>

                    <fieldset>
                        <label for="amount">Amount</label>
                        <input type="number" name="amount" id="amount" required value=${transaction ? transaction.amount : ""}>
                    </fieldset>

                    <fieldset>
                        <label for="date">Date</label>
                        <input type="date" name="date" id="date" value=${transaction ? transaction.date : ""}>
                        <label for="time">Time</label>
                        <input type="time" name="time" id="time" value=${transaction ? transaction.date : ""}>
                    </fieldset>

                    <fieldset>
                        <label for="category">Category</label>
                        <input type="category" name="category" id="category" value=${transaction ? transaction.category : ""}>
                    </fieldset>

                    <div class="err-message">
                        <p>${errMessage}</p>
                    </div>

                    <div class="buttons">
                        <button class="add-transaction-submit-btn">Add Transaction</button>
                    
                        <a href="/" class="add-transaction-cancel-btn">Cancel</a>
                    </div>
                </form>
            </div>`
}
