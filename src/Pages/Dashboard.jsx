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
  const [expenseCategory, setExpenseCategory] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // date, amount, name, category
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc

  // Predefined expense categories
  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping & Retail",
    "Entertainment",
    "Bills & Utilities",
    "Health & Medical",
    "Education",
    "Travel",
    "Home & Housing",
    "Other"
  ];

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
    if (!expenseName || !expenseAmount || !expenseCategory) {
      alert("Please fill in all fields including category.");
      return;
    }

    const newExpense = {
      name: expenseName,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      date: new Date().toISOString(),
      id: Date.now(), // Add unique ID for better management
    };

    setExpenses([newExpense, ...expenses]);
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("");
  }

  function handleDeleteExpense(id) {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  }

  function getFilteredExpenses() {
    let filtered = expenses;
    
    // Filter by month
    if (filterMonth) {
      filtered = filtered.filter((exp) => {
        const date = new Date(exp.date);
        return date.toISOString().slice(0, 7) === filterMonth;
      });
    }

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter((exp) => exp.category === filterCategory);
    }

    // Sort expenses
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "category":
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default: // date
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }

  function handleClearAll() {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setIncome("");
      setExpenses([]);
      localStorage.clear();
    }
  }

  function clearFilters() {
    setFilterMonth("");
    setFilterCategory("all");
    setSortBy("date");
    setSortOrder("desc");
  }

  const filteredExpenses = getFilteredExpenses();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="page-heading">Dashboard</h2>
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
        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {expenseCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="expense-history">
        <div className="expense-history-header">
          <h4>Expense History</h4>
          <div className="expense-stats">
            <span className="expense-count">
              {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
            </span>
            {(filterMonth || filterCategory !== "all") && (
              <span className="filter-indicator">
                Filtered by: {filterMonth ? `${new Date(filterMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}
                {filterMonth && filterCategory !== "all" ? " & " : ""}
                {filterCategory !== "all" ? filterCategory : ""}
              </span>
            )}
          </div>
        </div>

        <div className="expense-filters">
          <div className="filter-group">
            <label htmlFor="monthFilter">Filter by Month:</label>
            <input
              type="month"
              id="monthFilter"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="categoryFilter">Filter by Category:</label>
            <select
              id="categoryFilter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {expenseCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortOrder">Order:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest/High to Low</option>
              <option value="asc">Oldest/Low to High</option>
            </select>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        <div className="expense-list">
          {filteredExpenses.length > 0 ? (
            <div className="expense-items">
              {filteredExpenses.map((expense) => {
                const date = new Date(expense.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
                return (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-info">
                      <div className="expense-name">{expense.name}</div>
                      <div className="expense-details">
                        <span className="expense-date">{date}</span>
                        <span className="expense-category">{expense.category}</span>
                      </div>
                    </div>
                    <div className="expense-amount">
                      ₹{expense.amount}
                    </div>
                    <button 
                      className="delete-expense-btn"
                      onClick={() => handleDeleteExpense(expense.id)}
                      title="Delete expense"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-expenses">
              <p>No expenses found.</p>
              {(filterMonth || filterCategory !== "all") && (
                <button onClick={clearFilters} className="clear-filters-link">
                  Clear filters to see all expenses
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
