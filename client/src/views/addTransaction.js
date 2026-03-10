import { addTransaction } from '../api/data.js';

import { categoriesMasterList } from "../utils/categoryList.js";
import { utcToLocal } from "../utils/dateUtils.js";
import { transactionForm } from "./common/transactionForm.js";

export const addTransactionView = (ctx) => {

    let state = {
        errMessage: null,
        isSubmitting: false,
        submitLabel: "Adding...",
        selectedType: "expenses",
        selectedCategory: null,
        selectedDate: utcToLocal(new Date()),
        showCategoryModal: false,
    };

    const renderForm = () => ctx.render(transactionForm({
        onSubmit,
        onDelete: null,
        onTypeChange,
        onCategorySelect,
        onOpenModal,
        onCloseModal,
        onDateChange,
        transaction: null,
        state,
        title: "Add Transaction",
        submitLabel: "Add Transaction"
    }));

    renderForm();

    function onTypeChange(event) {
        state.selectedType = event.target.value;
        const stillValid = categoriesMasterList.find(c => c.name === state.selectedCategory && c.type === state.selectedType);

        if (!stillValid) {
            state.selectedCategory = null;
        }
        renderForm();
    }

    function onDateChange(event) {
        state.selectedDate = event.target.value;
        renderForm();
    }
    function onOpenModal() {
        state.showCategoryModal = true;
        renderForm();
    }
    function onCloseModal() {
        state.showCategoryModal = false;
        renderForm();
    }
    function onCategorySelect(name) {
        state.selectedCategory = name;
        state.showCategoryModal = false;
        renderForm();
    }

    async function onSubmit(event) {
        event.preventDefault();
        if (state.isSubmitting) {
            return
        }

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title")?.trim();
        const amountStr = formData.get("amount") ?? "";
        const amount = Number(formData.get("amount"));
        const note = formData.get("note")?.trim() ?? "";
        const { selectedDate: date, selectedType: type, selectedCategory: category } = state;

        if (!title || !type || !amount || !date) {
            state.errMessage = "Please fill the required fields.";
            return renderForm();
        }
        if (title.length > 30) {
            state.errMessage = "Title must be 30 characters or fewer.";
            return renderForm();
        }
        if (amount < 0.01) {
            state.errMessage = "Amount must be at least 0.01.";
            return renderForm();
        }
        if (amount > 999999.99) {
            state.errMessage = "Amount must be a maximum of 999,999.99.";
            return renderForm();
        }
        if (!/^\d+(\.\d{1,2})?$/.test(amountStr)) {
            state.errMessage = "Amount can have at most two decimal places.";
            return renderForm();
        }
        if (note.length > 200) {
            state.errMessage = `Note must be 200 characters or fewer. Current: ${note.length}`;
            return renderForm();
        }

        state.isSubmitting = true;
        state.errMessage = null;
        renderForm();

        try {
            await addTransaction({ title, type, amount, date, category, note })
            ctx.page.redirect("/")
        } catch (err) {
            state.errMessage = err.message
            state.isSubmitting = false
            renderForm()
        }
    }
};