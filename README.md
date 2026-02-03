# Personal Expense Tracker – Technical Documentation

## Overview

**Finora** is a **full-stack single-page application (SPA)** for personal expense tracking.  
It allows users to log income and expense transactions, monitor balance changes, and explore their financial activity through multiple interactive views.

The application follows a **client–server architecture** with a RESTful API and is designed with scalability, security, and maintainability in mind.

---

## Tech Stack

### Frontend
- **Vanilla JavaScript (SPA)**
- **page.js** – client-side routing
- **lit-html** – declarative and efficient rendering
- **HTML / CSS**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose for schema modeling)

### Development & Deployment
- RESTful API for frontend–backend communication

---

## Application Idea

The application is a **personal finance management tool**.

Users can:
- Record income and expense transactions
- Track balance movement over time
- View transactions grouped by month or by specific date
- Edit or delete previously recorded transactions

The primary goal is to give users **clear visibility into their financial behavior**, while providing a foundation for *future insights and personalized financial suggestions*.

---

## Architecture

### High-Level Architecture

The system follows a **client–server model**:

- The **frontend** handles routing, rendering, and user interaction
- The **backend** handles:
  - Authentication and authorization
  - Business logic
  - Data validation
  - Database interaction

The frontend communicates with the backend exclusively via **HTTP requests using JSON**.

---

## Backend Design Pattern

The backend follows the **MVC (Model–View–Controller)** pattern, with an additional **Service Layer** for database operations.

### Models
Models define the structure and relationships of persisted data and enforce schema-level validation.

### Controllers
Controllers handle incoming HTTP requests, validate intent, coordinate business logic, and return appropriate responses.

### Services
Services encapsulate all database interactions and complex data operations, keeping controllers thin and focused.

This layered approach improves:
- Separation of concerns
- Maintainability
- Testability

---

## Data Models

### User Model

Represents registered users of the application and stores authentication and personalization data.

**Key properties:**
- **username** – unique display name
- **email** – unique identifier used for authentication
- **password** – securely hashed credential
- **monthlyGoal** *(optional)* – user-defined monthly financial goal

**Behavior:**
- Passwords are hashed automatically before persistence
- Authentication-related fields are protected from accidental exposure
- Timestamps track account creation and updates

---

### Transaction Model

Represents individual financial records belonging to users.

**Key properties:**
- **title** – short description of the transaction
- **ownerId** – reference to the owning user
- **type** – `income` or `expenses`
- **amount** – monetary value with two-decimal precision
- **date** – date the transaction occurred
- **category** – logical grouping (e.g. food, rent, salary)

**Behavior:**
- Transactions are always associated with a single user
- Indexed fields support efficient filtering by owner and date
- Timestamps track creation and modification

---

## Business Logic

Core business rules include:

- Users can only access and manipulate their own data
- Balance is computed dynamically from all income and expense transactions
- Transactions can be filtered and grouped by:
  - Month
  - Specific date
  - Transaction type
- Any transaction update immediately affects:
  - Balance calculations
  - Visualizations
  - Transaction listings

*(Planned: category analytics and financial insights.)*

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

### Finance (`financeController`)

| Method | Endpoint   | Description                           |
| ------ | ---------- | ------------------------------------- |
| GET    | `/balance` | Returns the user’s calculated balance |

*(Planned: extended summaries and financial insights.)*

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
- Displays **current balance**
- Shows **latest transactions**
- Visualizes balance movement with a **line chart**
- *(Planned: insights and personalized suggestions)*

#### Transactions View
- Displays transactions for a selected month
- Month navigation updates data dynamically

#### Calendar View
- Interactive calendar with highlighted transaction dates
- Selecting a date displays all transactions for that day

---

## Transaction Management

### Adding Transactions

Logged-in users can add a new transaction from any protected view using a persistent action button.  
This opens a form where the user enters the transaction details such as title, type, amount, date, and category.

Once the form is submitted, the transaction is saved and immediately becomes part of the user’s data.

### Editing and Deleting Transactions

Clicking on an existing transaction opens the same form with all fields pre-filled using the transaction data retrieved from the database.  
From there, users can update the transaction details or delete the transaction entirely.

Any changes are reflected right away across the application, including the balance, charts, and transaction lists.


---

## Future Improvements *(Planned)*

- Financial insights and analytics
- Budget tracking and alerts
- Category-based spending summaries
- Data export functionality
