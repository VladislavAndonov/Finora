# Personal Expense Tracker - Technical Documentation

## Overview

**Finora** is a **full-stack single-page application (SPA)** for personal expense tracking.  
It allows users to manage multiple financial accounts, log income and expense transactions, and monitor financial health through interactive data visualizations.

**Live Deployment:** [https://finora-web.netlify.app](https://finora-web.netlify.app)

**Demo Credentials:**
* **Button:** Use the "Demo login" button on the login page.
* **Manual:** Email: `demo@gmail.com` | Password: `123456`

---

## Tech Stack

### Frontend
- **Vanilla JavaScript (SPA)**
- **page.js** - client-side routing.
- **lit-html** - declarative and efficient rendering.
- **HTML / CSS** - implemented with **BEM (Block Element Modifier)** naming convention for style encapsulation.
- **Chart.js** - integrated for dynamic data representation and financial graphing.

### Backend
- **Node.js & Express.js**
- **MongoDB** (with Mongoose for schema modeling).

### Development & Deployment
- **Vite** - frontend build tool and bundler.
- **Fly.io** - backend hosting.
- **Netlify** - frontend hosting.

---

## Application Idea

The application is a **personal finance management tool**.

Users can:
- Manage multiple financial accounts under a single profile.
- Record income and expense transactions.
- Track balance movement over time with interactive graphs.
- View transactions grouped by month, specific date, or **custom date ranges** (e.g., last 30 days).
- Edit or delete previously recorded transactions.


The primary goal is to give users **clear visibility into their financial behavior**.

---

## Architecture

### High-Level Architecture

The system follows a **client-server model**. The data hierarchy supports a nested relationship:  
**One User ➔ Multiple Accounts ➔ Multiple Transactions.**

- The **frontend** handles routing, rendering, and user interaction
- The **backend** handles:
  - Authentication and authorization
  - Business logic
  - Data validation
  - Database interaction

The frontend communicates with the backend exclusively via **HTTP requests using JSON**.

---

## Data Models

### User Model
Represents registered users and authentication data.
- **username** - unique display name
- **email** - unique identifier used for authentication
- **password** - securely hashed credential
- **monthlyGoal** *(optional)* - user-defined monthly financial goal

### Account Model
Allows users to separate finances into distinct buckets (e.g., Savings, Checking).
- **name** - title of the account (max 30 chars).
- **ownerId** - reference to the User.
- **currency** - supported ISO codes (USD, EUR, BTC, etc.).
- **balance** - Although the account document stores a numeric balance for quick access, this value cannot be edited directly.
- **isArchived** - flag for soft-deletion/deactivation.

### Transaction Model
Represents individual financial records.
- **title** - name of the transaction.
- **ownerId** - reference to the User.
- **accountId** - reference to the parent account.
- **type** - `income` or `expenses`.
- **amount** - monetary value.
- **date** - date of occurrence.
- **category** - logical grouping (e.g. Groceries, Rent, Salary)
- **note** *(optional)* - a description of the transaction.

---

## API Endpoints

All protected endpoints require authentication via JWT.

---

### Authentication (`authController`)

| Method | Endpoint         | Description                                             |
| ------ | ---------------- | ------------------------------------------------------- |
| POST   | `/auth/register` | Registers a new user                                    |
| POST   | `/auth/login`    | Authenticates a user and issues a JWT                   |
| GET    | `/auth/logout`   | Clears authentication data                              |
| GET    | `/auth/me`       | Validates the current session and returns user identity |

**`/auth/me`** is used for **authentication state restoration** on the client after page refreshes or reloads.

---

### Transactions (`transactionController`)

| Method | Endpoint            | Description                                     |
| ------ | ------------------- | ----------------------------------------------- |
| GET    | `/transactions`     | Returns transactions for the authenticated user |
| POST   | `/transactions`     | Creates a new transaction                       |
| GET    | `/transactions/:id` | Returns a transaction by ID                     |
| PUT    | `/transactions/:id` | Updates a transaction                           |
| DELETE | `/transactions/:id` | Deletes a transaction                           |

**Query capabilities:**
- Always scoped to the authenticated user
- Optional filtering by date and transaction type
- Sorting and limiting supported for dynamic views

---

### Accounts (`accountController`)

| Method | Endpoint        | Description                                                       |
| ------ | --------------- | ----------------------------------------------------------------- |
| GET    | `/accounts`     | Returns all active accounts for the user                          |
| POST   | `/accounts`     | Creates a new financial account (name, currency, startingBalance) |
| GET    | `/accounts/:Id` | Returns an account by ID                                          |
| PUT    | `/accounts/:id` | Updates account details                                           |

**Important business rule**: Accounts cannot be deleted. They can only be archived (soft-delete) using the **`isArchived`** flag. The backend enforces archive-only deletion.

---

## Security

Security is implemented at multiple layers:

- **bcrypt** for password hashing
- **JWT** for stateless authentication
- Tokens stored in **HTTP-only cookies**
- **authMiddleware** validates tokens and clears expired sessions
- Input validation on:
  - Client level
  - Server level
  - Schema level

This ensures data integrity, access control, and protection against common attack vectors.

---

## Client-Side Routing & Guards

The frontend uses **page.js** for routing. Routes are protected by authentication and guest guards, ensuring proper access control.
Dynamic routes are used for transaction editing, and a fallback route handles unknown paths.

### Route Guards
- **Auth Guard** – restricts authenticated-only views
- **Guest Guard** – prevents logged-in users from accessing guest pages

---

## Views & User Experience

### Guest Views
- Login
- Register

### Authenticated Views

#### Home View
- Displays a list of all **active accounts**. Users can click an account to set it as "active" and dashboard data will dynamically update.
- Displays **current balance**
- Shows **latest transactions**
- Visualizes balance movement with a **line graph**
- The Home view includes a button that opens an Accounts modal. From the modal:
  - Selecting an account opens the edit page: /accounts/edit/:id.
  - Clicking Create Account opens the add account page: /accounts/add.


#### Transactions View
- Displays transactions for a selected month
- Month navigation updates data dynamically
- A visual representation of transactions for the current month by categories represented by two doughnut graphs - expenses and income.

#### Calendar View
- Interactive calendar with highlighted transaction dates
- Selecting a date displays all transactions for that day

---

## Transaction Management

Transactions are the **only way to change an account’s balance**.  
Any transaction that is created, edited, or deleted automatically updates the related account balance.

### Adding a Transaction
- Users can add a transaction from any authenticated view using the **global action button**.
- A form opens where the user provides:
  - title
  - type (`income` or `expense`)
  - amount
  - date
  - category
  - note
- After submission, the transaction is saved and immediately reflected in:
  - account balances
  - charts and visualizations
  - transaction lists

### Editing or Deleting a Transaction
- Selecting a transaction opens the same form with **pre-filled data**.
- Users can:
  - update transaction details
  - delete the transaction
- Any change instantly updates all related data across the application.

---

## Account Management

Accounts organize a user's finances (e.g., checking, savings, crypto wallets).  
Unlike transactions, **accounts cannot directly modify balances**.

### Adding an Account
When creating an account, the API accepts a `startingBalance`. However, this value is **not written directly to the account balance**.

Instead the backend performs two operations:
1. Creates the account with a default balance.
2. Creates a **starting balance transaction** linked to that account.

Both operations run inside a **MongoDB session**, ensuring they succeed or fail together and keeping the data consistent.

### Editing an Account
Users can update account details such as:
- name
- currency
- archive status

The account **balance cannot be edited directly**.  
Any API request attempting to change the balance through the account update endpoint is rejected.

---

## Future Improvements *(Planned)*

- Budget tracking
- Financial insights and analytics
- Data export functionality
