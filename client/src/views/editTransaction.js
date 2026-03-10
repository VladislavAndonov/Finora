import { deleteTransaction, editTransaction, getTransactionById } from '../api/data.js';
import { utcToLocal } from '../utils/dateUtils.js';
import { categoriesMasterList } from "../utils/categoryList.js";
import { transactionForm } from "./common/transactionForm.js";

export const editTransactionView = async (ctx) => {
    const tId = ctx.params.id;
    let transaction = null;

    try {
        const result = await getTransactionById(tId);
        transaction = { ...result, date: utcToLocal(result.date) };
    } catch (err) {
        console.log(err.message);
    }

    let state = {
        errMessage: null,
        isSubmitting: false,
        submitLabel: "Submitting...",
        selectedType: transaction.type,
        selectedCategory: transaction.category,
        selectedDate: transaction.date,
        showCategoryModal: false,
    };

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
        renderForm()

        try {
            await editTransaction(tId, { title, type, amount, date, category, note });
            ctx.page.redirect("/");
        } catch (err) {
            state.errMessage = err.message
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
            ctx.page.redirect("/")
        } catch (err) {
            state.errMessage = err.message
            state.isSubmitting = false
            renderForm()
        }
    }
};