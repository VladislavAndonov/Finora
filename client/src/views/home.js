const root = document.querySelector(".main-content")
export function homePage() {
    root.innerHTML = `
    <header class="home-header">
        <h2>Home</h2>
    </header>
    <section class="bento">
        <article class="budgets">Budgets</article>
        <article class="line-graph">Line graph</article>
        <article class="transaction-list">Transaction list</article>
    </section>
    `
};