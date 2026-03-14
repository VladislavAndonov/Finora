import { addTransaction } from '../api/data.js';

import { categoriesMasterList } from "../utils/categoryList.js";
import { utcToLocal } from "../utils/dateUtils.js";
import { showToast } from '../utils/toast.js';
import { transactionForm } from "./common/transactionForm.js";

export const addTransactionView = (ctx) => {

    const state = {
        errMessage: null,
        isSubmitting: false,
        submitLabel: "Adding...",
        selectedType: "expenses",
        selectedCategory: null,
        selectedDate: utcToLocal(new Date()),
        showCategoryModal: false,
        unfilledInputs: []
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
        const amount = Number(formData.get("amount"));
        const note = formData.get("note")?.trim() ?? "";
        const { selectedDate: date, selectedType: type, selectedCategory: category } = state;

        if (!title) {
            state.unfilledInputs.push("title");
        }
        if (!type) {
            state.unfilledInputs.push("type");
        }
        if (!amount) {
            state.unfilledInputs.push("amount");
        }
        if (!date) {
            state.unfilledInputs.push("date");
        }
        if (!category) {
            state.unfilledInputs.push("category");
        }
        if (state.unfilledInputs.length > 0) {
            state.errMessage = `Please fill ${state.unfilledInputs.join(", ")}`;
            return renderForm();
        }


        if (title.length > 30) {
            state.errMessage = "Title must be 30 characters or fewer.";
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
        renderForm();

        try {
            await addTransaction({ title, type, amount, date, category, note })
            showToast("Transaction successfully added.")
            ctx.page.redirect("/")
        } catch (err) {
            showToast("Failed to add transaction.", "error");
            state.isSubmitting = false
            renderForm()
        }
    }
};