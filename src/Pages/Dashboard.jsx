import React, { useState, useEffect } from "react";
import "../css/Dashboard.css";

export default function Dashboard() {
  const [income, setIncome] = useState(() => {
    const savedIncome = localStorage.getItem("income");
    return savedIncome ? Number(savedIncome) : "";
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const totalExpense = getFilteredExpenses().reduce((sum, item) => sum + item.amount, 0);
  const balance = income - totalExpense;

  // Save income and expenses
  useEffect(() => {
    localStorage.setItem("income", income);
  }, [income]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  function handleAddExpense(e) {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;

    const newExpense = {
      name: expenseName,
      amount: parseFloat(expenseAmount),
      date: new Date().toISOString(),
    };

    setExpenses([newExpense, ...expenses]);
    setExpenseName("");
    setExpenseAmount("");
  }

  function getFilteredExpenses() {
    if (!filterMonth) return expenses;
    return expenses.filter((exp) => {
      const date = new Date(exp.date);
      return date.toISOString().slice(0, 7) === filterMonth;
    });
  }

  function handleClearAll() {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setIncome("");
      setExpenses([]);
      localStorage.clear();
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div>
          <button className="add-expense-button" onClick={() =>
            document.getElementById("expense-form").scrollIntoView({ behavior: "smooth" })}>
            + Add Expense
          </button>
          <button className="clear-button" onClick={handleClearAll}>Clear All</button>
        </div>
      </div>

      <div className="income-input-section">
        <label htmlFor="incomeInput">Enter Monthly Income:</label>
        <input
          type="number"
          id="incomeInput"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          placeholder="e.g. 50000"
        />
      </div>

      <div className="summary-boxes">
        <div className="summary-box income-box">
          <h3>Monthly Income</h3>
          <p>₹{income || 0}</p>
        </div>
        <div className="summary-box expense-box">
          <h3>Total Expenses</h3>
          <p>₹{totalExpense}</p>
        </div>
        <div className="summary-box balance-box">
          <h3>Balance</h3>
          <p>₹{balance || 0}</p>
        </div>
      </div>

      <form onSubmit={handleAddExpense} id="expense-form" className="add-expense-form">
        <h4>Add New Expense</h4>
        <input
          type="text"
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <div className="expense-history">
        <h4>Expense History</h4>
        <label htmlFor="monthFilter">Filter by Month:</label>
        <input
          type="month"
          id="monthFilter"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
        <ul>
          {getFilteredExpenses().map((expense, index) => {
            const date = new Date(expense.date).toLocaleDateString();
            return (
              <li key={index}>
                {date} — <strong>{expense.name}</strong>: ₹{expense.amount}
              </li>
            );
          })}
          {getFilteredExpenses().length === 0 && <li>No expenses found.</li>}
        </ul>
      </div>
    </div>
  );
}
