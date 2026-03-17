import "../../../styles/transactionForm.css";

import { html } from "lit-html";
import { categoriesMasterList } from "../../utils/categoryList.js";
import { formatDate, formatHour, formatMinute, formatAmPm } from "../../utils/dateUtils.js";

export const transactionForm = ({
    onSubmit,
    onDelete,
    onTypeChange,
    onCategorySelect,
    onOpenModal,
    onCloseModal,
    onDateChange,
    transaction,
    state,
    title,
    submitLabel
}) => {
    const selectedCategory = categoriesMasterList.find(c => c.name === state.selectedCategory && c.type === state.selectedType);
    const cardColor = selectedCategory?.color ?? "rgb(170, 170, 170)";

    return html`
        <div class="transaction-form">

            <nav class="transaction-form__nav">
                <button class="transaction-form__nav-btn" type="button" @click=${() => history.back()}>
                    <i class="ph-bold ph-arrow-left"></i>
                </button>
                <h1 class="transaction-form__title">${title}</h1>
                ${onDelete ? html`
                    <button class="transaction-form__nav-btn transaction-form__nav-btn--danger" type="button"
                        @click=${onDelete} ?disabled=${state.isSubmitting}>
                        <i class="ph-fill ph-trash"></i>
                    </button>
                ` : html`<div class="transaction-form__nav-spacer"></div>`}
            </nav>

            <form class="transaction-form__body" @submit=${onSubmit}>

                <div class="transaction-form__card" style="background-color: ${cardColor}">
                    <div class="transaction-form__type-toggle">
                        <label class="transaction-form__type-option ${state.selectedType === 'expenses' ? 'active' : ''}">
                            <input type="radio" name="type" value="expenses" .checked=${state.selectedType === 'expenses'} @change=${onTypeChange}>
                            <i class="transaction-form__card-icon ph-fill ph-caret-down"></i>
                            Expense
                        </label>
                        <label class="transaction-form__type-option ${state.selectedType === 'income' ? 'active' : ''}">
                            <input type="radio" name="type" value="income" .checked=${state.selectedType === 'income'} @change=${onTypeChange}>
                            <i class="transaction-form__card-icon ph-fill ph-caret-up"></i>
                            Income
                        </label>
                    </div>
                    <div class="transaction-form__card-body">
                        <div class="transaction-form__card-amount-wrap">
                            <div class="transaction-form__currency-row">
                                <span class="prefix">$</span>
                                <input class="transaction-form__amount-input" type="number" name="amount"
                                    inputmode="numeric" step="any" placeholder="0.00" autocomplete="off"
                                    value=${transaction?.amount != null ? (transaction.amount % 1 === 0 ? transaction.amount : Number(transaction.amount).toFixed(2)) : ""}>
                            </div>
                            <span class="transaction-form__card-category-text">
                                ${state.selectedCategory ?? 'Select Category'}
                            </span>
                        </div>
                        <button class="transaction-form__card-category-btn" type="button" @click=${onOpenModal}>
                            <i class=${selectedCategory?.icon ?? 'ph-duotone ph-tag'}></i>
                        </button>
                    </div>
                </div>

                <input type="hidden" name="category" value=${state.selectedCategory ?? ''}>

                <div class="input-wrapper">
                    <i class="transaction-form__input-icon ph-bold ph-text-t"></i>
                    <input class="transaction-form__input" maxlength="30" type="text" name="title"
                        placeholder="Title" value=${transaction?.title ?? ''}>
                </div>

                <div class="input-wrapper">
                    <i class="transaction-form__input-icon ph-bold ph-note"></i>
                    <textarea class="transaction-form__input transaction-form__input--textarea"
                        name="note" maxlength="200" placeholder="Note">${transaction?.note ?? ''}</textarea>
                </div>

                <div class="transaction-form__datetime-row"
                    @click=${() => document.getElementById('date').showPicker()}>
                    <div class="transaction-form__calendar-icon">
                        <i class="ph ph-calendar-blank"></i>
                    </div>
                    <span class="transaction-form__date-label">${formatDate(state.selectedDate)}</span>
                    <div class="transaction-form__time-display">
                        <span class="transaction-form__time-part">${formatHour(state.selectedDate)}</span>
                        <span class="transaction-form__time-sep">:</span>
                        <span class="transaction-form__time-part">${formatMinute(state.selectedDate)}</span>
                        <span class="transaction-form__time-ampm">${formatAmPm(state.selectedDate)}</span>
                    </div>
                    <input class="transaction-form__datetime--hidden"
                        type="datetime-local" id="date" name="date"
                        value=${state.selectedDate ?? ''} @change=${onDateChange}>
                </div>

                ${state.errMessage ? html`<p class="transaction-form__error">${state.errMessage}</p>` : null}

                <div class="transaction-form__actions">
                    <button class="transaction-form__save-btn" type="submit"
                        ?disabled=${state.isSubmitting}>
                        ${state.isSubmitting ? state.submitLabel : submitLabel}
                    </button>
                </div>

            </form>

            ${state.showCategoryModal ? html`
                <div class="category-modal__backdrop" @click=${onCloseModal}>
                    <div class="category-modal" @click=${(e) => e.stopPropagation()}>
                        <div class="category-modal__header">
                            <h2 class="category-modal__title">Select Category</h2>
                            <div class="category-modal__header-actions">
                                <button class="category-modal__close" type="button" @click=${onCloseModal}>
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>
                        <div class="category-modal__grid">
                            ${categoriesMasterList
                .filter(c => c.type === state.selectedType)
                .map(c => html`
                                    <button type="button"
                                        class="category-modal__item ${state.selectedCategory === c.name ? 'selected' : ''}"
                                        @click=${() => onCategorySelect(c.name)}>
                                        <div class="category-modal__icon-wrap" style="background-color: ${c.color}">
                                            <i class=${c.icon}></i>
                                        </div>
                                        <span class="category-modal__label">${c.name}</span>
                                    </button>
                                `)}
                        </div>
                    </div>
                </div>
            ` : null}

        </div>
    `;
};