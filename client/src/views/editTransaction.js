import { deleteTransaction, editTransaction, getTransactionById } from '../api/data.js';
import { utcToLocal } from '../utils/dateUtils.js';
import { categoriesMasterList } from "../utils/categoryList.js";
import { transactionForm } from "./common/transactionForm.js";
import { showToast } from '../utils/toast.js';

export const editTransactionView = async (ctx) => {
    const tId = ctx.params.id;
    let transaction = null;

    const state = {
        errMessage: null,
        isSubmitting: false,
        submitLabel: "Submitting...",
        selectedType: "expenses",
        selectedCategory: null,
        selectedDate: null,
        showCategoryModal: false,
    };

    try {
        const result = await getTransactionById(tId);
        transaction = { ...result, date: utcToLocal(result.date) };

        state.selectedType = transaction.type;
        state.selectedCategory = transaction.category
        state.selectedDate = transaction.date
    } catch (err) {
        showToast("Transaction not found.", "error");
        ctx.page.redirect("/");
        return
    }

    const renderForm = () => ctx.render(transactionForm({
        onSubmit,
        onDelete,
        onTypeChange,
        onCategorySelect,
        onOpenModal,
        onCloseModal,
        onDateChange,
        transaction,
        state,
        title: "Edit Transaction",
        submitLabel: "Save Changes"
    }));

    renderForm();

    function onTypeChange(event) {
        state.selectedType = event.target.value;
        if (state.selectedType === transaction.type) {
            state.selectedCategory = transaction.category;
        } else {
            const stillValid = categoriesMasterList.find(c => c.name === state.selectedCategory && c.type === state.selectedType);
            if (!stillValid) {
                state.selectedCategory = null;
            }
        }
        renderForm();
    }

    function onDateChange(event) {
        state.selectedDate = event.target.value; renderForm();
    }
    function onOpenModal() {
        state.showCategoryModal = true; renderForm();
    }
    function onCloseModal() {
        state.showCategoryModal = false; renderForm();
    }
    function onCategorySelect(name) {
        state.selectedCategory = name; state.showCategoryModal = false; renderForm();
    }

    async function onSubmit(event) {
        event.preventDefault();
        if (state.isSubmitting) {
            return
        }

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title")?.trim();
        const amountInput = formData.get("amount")?.trim();
        const amount = Number(amountInput);
        const note = formData.get("note")?.trim() ?? "";
        const { selectedDate: date, selectedType: type, selectedCategory: category } = state;

        if (!title) {
            state.errMessage = `Please enter a transaction title.`
            return renderForm();
        }
        if (!type) {
            state.errMessage = `Please, select transaction type`
            return renderForm();
        }
        if (!amount) {
            state.errMessage = `Please, enter transaction amount`
            return renderForm();
        }
        if (!date) {
            state.errMessage = `Please, select transaction date`
            return renderForm();
        }
        if (!category) {
            state.errMessage = `Please, select transaction category`
            return renderForm();
        }

        if (title.length > 30) {
            state.errMessage = "Title must be 30 characters or fewer.";
            return renderForm();
        }

        if (!amountInput) {
            state.errMessage = "Please enter a transaction amount.";
            return renderForm();
        }
        if (!/^\d+(\.\d{1,2})?$/.test(amountInput)) {
            state.errMessage = "Amount can have at most 2 decimal places.";
            return renderForm();
        }
        if (isNaN(amount)) {
            state.errMessage = "Please enter a valid amount.";
            return renderForm();
        }
        if (amount < 0.01) {
            state.errMessage = "Amount must be at least 0.01.";
            return renderForm();
        }
        if (amount > 999999.99) {
            state.errMessage = "Amount must be at most 999,999.99.";
            return renderForm();
        }

        if (note.length > 200) {
            state.errMessage = `Note must be 200 characters or fewer. Current: ${note.length}`;
            return renderForm();
        }

        state.isSubmitting = true;
        state.errMessage = null;
        renderForm()

        try {
            await editTransaction(tId, { title, type, amount, date, category, note });
            showToast("Transaction successfully updated.")
            ctx.page.redirect("/");
        } catch (err) {
            showToast("Failed to update transaction.", "error");
            state.isSubmitting = false
            renderForm()
        }
    }

    async function onDelete() {
        state.isSubmitting = true;
        state.errMessage = null;
        renderForm();
        try {
            await deleteTransaction(tId)
            showToast("Transaction successfully deleted.")
            ctx.page.redirect("/")
        } catch (err) {
            showToast("Failed to delete transaction.", "error");
            state.isSubmitting = false
            renderForm()
        }
    }
};