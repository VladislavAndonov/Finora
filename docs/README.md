# Finora — Personal Expense Tracker

A full-stack web application with a Single-Page Application (SPA) frontend for managing personal finances. Track accounts, log transactions, and visualize your spending habits over time.

**Live Demo:** **[finora-web.netlify.app](https://finora-web.netlify.app)**  
**Demo login:** `demo@gmail.com` / `123456` — or use the "Try the demo" button on the login page.

---

![Finora preview](/client/public/images/desktop-1.png)
![Finora preview](/client/public/images/desktop-2.png)
![Finora preview](/client/public/images/mobile-1.png) ![Finora preview](/client/public/images/mobile-2.png)

---

## Features

- Manage multiple financial accounts (checking, savings, crypto, etc.) under one profile
- Log income and expense transactions with categories, dates, and notes
- Interactive line graph showing balance movement over time
- Transactions view grouped by month, with doughnut charts by category
- Calendar view with highlighted transaction dates
- Custom date range filtering (e.g. last 30 days)

## Tech Stack

**Frontend**
- Vanilla JavaScript SPA — page.js (routing), lit-html (rendering), Chart.js (graphs)
- Custom CSS design system — Golden Ratio–based spacing scale, color variables, and BEM naming for consistency

**Backend**
- Node.js & Express.js
- MongoDB with Mongoose

**Deployment**
- Frontend: Netlify
- Backend: Fly.io

## Running Locally

```bash
# Clone the repo
git clone https://github.com/VladislavAndonov/Finora

# Install dependencies
npm install

# Start the development server
cd server/ && npm start 

# Start the client
cd client/ && npm run dev

```

> Make sure to set up your `.env` file with your MongoDB connection string and JWT secret before running.

---

For full technical details — data models, API endpoints, architecture, and security — see [DOCUMENTATION.md](./DOCUMENTATION.md).