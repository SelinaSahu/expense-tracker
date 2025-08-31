import React, { useEffect, useState, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid
} from "recharts";
import html2canvas from "html2canvas";
import "../css/Reports.css";

export default function Reports() {
  const [income, setIncome] = useState(0); 
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState("pie");
  const [category, setCategory] = useState("all");
  const chartRef = useRef(null);

  useEffect(() => {
    const savedIncome = Number(localStorage.getItem("income")) || 0;
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - 60);

    const recentExpenses = savedExpenses
      .map(exp => ({
        ...exp,
        date: new Date(exp.date),
        category: exp.name.toLowerCase(),
      }))
      .filter(exp => exp.date >= cutoff);

    setIncome(savedIncome);
    setExpenses(recentExpenses);
  }, []);

  const filteredExpenses =
    category === "all"
      ? expenses
      : expenses.filter(exp => exp.category === category.toLowerCase());

  // Calculate total expenses and balance
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = income - totalExpenses;

  // Group expenses by category for pie chart
  const categoryData = {};
  filteredExpenses.forEach(exp => {
    const category = exp.category || 'Uncategorized';
    if (!categoryData[category]) {
      categoryData[category] = 0;
    }
    categoryData[category] += exp.amount;
  });

  const pieData = Object.keys(categoryData).map(name => ({
    name: name,
    value: categoryData[name]
  }));

  // Add balance to pie chart if showing all categories (no income)
  const fullPieData = category === "all" ? [
    { name: "Balance", value: Math.max(0, balance), type: "balance" },
    ...pieData.map(item => ({ ...item, type: "expense" }))
  ] : pieData;

  // Daily data for bar chart
  const dailyData = {};
  filteredExpenses.forEach(exp => {
    const day = exp.date.toISOString().split("T")[0];
    if (!dailyData[day]) dailyData[day] = { expenses: 0, count: 0 };
    dailyData[day].expenses += exp.amount;
    dailyData[day].count += 1;
  });

  // Create bar chart data based on view type
  let barChartData = [];
  
  if (category === "all") {
    // Show daily expenses when viewing all categories
    if (Object.keys(dailyData).length > 0) {
      barChartData = Object.keys(dailyData)
        .sort()
        .map(date => {
          const dateObj = new Date(date);
          return {
            date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            expenses: Math.round(dailyData[date].expenses * 100) / 100, // Round to 2 decimal places
            count: dailyData[date].count,
            fullDate: date // Keep original date for sorting
          };
        })
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
        .map(({ fullDate, ...rest }) => rest); // Remove fullDate from final data
    }
  } else {
    // Show category breakdown when a specific category is selected
    const categoryExpenses = filteredExpenses.filter(exp => exp.category === category);
    
    if (categoryExpenses.length > 0) {
      const categoryDailyData = {};
      
      categoryExpenses.forEach(exp => {
        const day = exp.date.toISOString().split("T")[0];
        if (!categoryDailyData[day]) categoryDailyData[day] = 0;
        categoryDailyData[day] += exp.amount;
      });
      
      barChartData = Object.keys(categoryDailyData)
        .sort()
        .map(date => {
          const dateObj = new Date(date);
          return {
            date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            expenses: Math.round(categoryDailyData[date] * 100) / 100,
            fullDate: date
          };
        })
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
        .map(({ fullDate, ...rest }) => rest);
    }
  }

  // Calculate moving average for line chart trend analysis
  const calculateMovingAverage = (data, window = 3) => {
    if (data.length < window) return data;
    
    return data.map((item, index) => {
      if (index < window - 1) return item;
      
      const sum = data
        .slice(index - window + 1, index + 1)
        .reduce((acc, curr) => acc + (curr.expenses || 0), 0);
      
      return {
        ...item,
        movingAverage: Math.round((sum / window) * 100) / 100
      };
    });
  };

  // Add moving average to data for line chart
  const lineChartData = view === "line" ? calculateMovingAverage(barChartData) : barChartData;

  // If no data, create a placeholder
  if (barChartData.length === 0) {
    barChartData = [{
      date: "No Data",
      expenses: 0
    }];
  }

  // Color scheme for different expense categories
  const EXPENSE_COLORS = {
    // Food & Dining
    food: "#FF6B6B",           // Red-Orange
    restaurant: "#FF6B6B",     // Red-Orange
    groceries: "#FF6B6B",      // Red-Orange
    dining: "#FF6B6B",         // Red-Orange
    
    // Transportation
    transport: "#4ECDC4",      // Teal
    fuel: "#4ECDC4",           // Teal
    uber: "#4ECDC4",           // Teal
    taxi: "#4ECDC4",           // Teal
    parking: "#4ECDC4",        // Teal
    
    // Shopping & Retail
    shopping: "#45B7D1",       // Blue
    clothes: "#45B7D1",        // Blue
    amazon: "#45B7D1",         // Blue
    retail: "#45B7D1",         // Blue
    
    // Entertainment
    entertainment: "#96CEB4",  // Green
    movie: "#96CEB4",          // Green
    game: "#96CEB4",           // Green
    netflix: "#96CEB4",        // Green
    
    // Bills & Utilities
    bill: "#FFEAA7",           // Yellow
    utility: "#FFEAA7",        // Yellow
    electricity: "#FFEAA7",    // Yellow
    water: "#FFEAA7",          // Yellow
    internet: "#FFEAA7",       // Yellow
    
    // Health & Medical
    health: "#DDA0DD",         // Plum
    medical: "#DDA0DD",        // Plum
    doctor: "#DDA0DD",         // Plum
    medicine: "#DDA0DD",       // Plum
    
    // Education
    education: "#98D8C8",      // Mint
    course: "#98D8C8",         // Mint
    book: "#98D8C8",           // Mint
    training: "#98D8C8",       // Mint
    
    // Travel
    travel: "#F7DC6F",         // Gold
    flight: "#F7DC6F",         // Gold
    hotel: "#F7DC6F",          // Gold
    
    // Home & Housing
    home: "#BB8FCE",           // Lavender
    rent: "#BB8FCE",           // Lavender
    maintenance: "#BB8FCE",    // Lavender
    
    // Default colors for uncategorized expenses
    default: "#6C757D"         // Gray
  };

  // Function to get color for expense category
  const getExpenseColor = (expenseName) => {
    const lowerName = expenseName.toLowerCase();
    
    // Check for exact matches first
    if (EXPENSE_COLORS[lowerName]) {
      return EXPENSE_COLORS[lowerName];
    }
    
    // Check for partial matches
    for (const [category, color] of Object.entries(EXPENSE_COLORS)) {
      if (lowerName.includes(category) || category.includes(lowerName)) {
        return color;
      }
    }
    
    // Return default color if no match found
    return EXPENSE_COLORS.default;
  };

  // Color scheme for chart types
  const COLORS = {
    balance: "#17a2b8",   // Blue for balance
    expense: "#dc3545",   // Red for expenses (fallback)
    default: "#6c757d"    // Gray for default
  };

  const getColor = (entry) => {
    if (entry.type === "balance") return COLORS.balance;
    if (entry.type === "expense") {
      // Use the specific expense color if available
      return getExpenseColor(entry.name);
    }
    return COLORS.default;
  };

  const handleExport = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "expense_report.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const uniqueCategories = ["all", ...new Set(expenses.map(e => e.category || 'Uncategorized'))];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2 className="page-heading">Financial Reports (Last 60 Days)</h2>
        <div className="reports-summary">
          <div className="summary-item income">
            <span className="label">Monthly Income:</span>
            <span className="value">₹{income.toLocaleString()}</span>
          </div>
          <div className="summary-item expenses">
            <span className="label">Total Expenses:</span>
            <span className="value">₹{totalExpenses.toLocaleString()}</span>
          </div>
          <div className="summary-item balance">
            <span className="label">Balance:</span>
            <span className="value">₹{balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="reports-controls">
        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="categorySelect">Filter by Category:</label>
          <select
            id="categorySelect"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {uniqueCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Chart Type Toggle */}
        <div className="chart-controls">
          <button 
            className={view === "pie" ? "active" : ""} 
            onClick={() => setView("pie")}
          >
            Pie Chart
          </button>
          <button 
            className={view === "bar" ? "active" : ""} 
            onClick={() => setView("bar")}
          >
            Bar Chart
          </button>
          <button 
            className={view === "line" ? "active" : ""} 
            onClick={() => setView("line")}
          >
            Line Chart
          </button>
          <button className="export-btn" onClick={handleExport}>
            Export Chart
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div ref={chartRef} className="chart-container">
        <div className="chart-header">
          <h3>
            {view === "bar" ? "Bar Chart" : view === "line" ? "Line Chart" : "Pie Chart"}
          </h3>
          <p className="chart-description">
            {view === "bar" 
              ? category === "all" 
                ? "Daily expense amounts and transaction counts over time"
                : `Daily ${category} expenses over time`
              : view === "line"
              ? category === "all"
                ? "Expense trends with 3-day moving average and transaction counts"
                : `${category} expense trends with 3-day moving average`
              : "Expense breakdown by category"
            }
          </p>
        </div>
        
        {view === "bar" ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'expenses' ? `₹${value.toLocaleString()}` : value,
                  name === 'expenses' ? 'Amount' : 'Transactions'
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  padding: '10px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="expenses" 
                fill={COLORS.expense} 
                name="Amount"
                radius={[4, 4, 0, 0]}
              />
              {category === "all" && barChartData[0]?.count !== undefined && (
                <Bar 
                  dataKey="count" 
                  fill={COLORS.default} 
                  name="Transactions"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        ) : view === "line" ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'expenses' ? `₹${value.toLocaleString()}` : value,
                  name === 'expenses' ? 'Amount' : 'Transactions'
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  padding: '10px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke={COLORS.expense} 
                name="Amount" 
                strokeWidth={3}
                dot={{ fill: COLORS.expense, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: COLORS.expense, strokeWidth: 2, fill: '#fff' }}
                connectNulls={true}
              />
              {lineChartData[0]?.movingAverage !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="movingAverage" 
                  stroke="#FF6B6B" 
                  name="3-Day Average" 
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  dot={false}
                  activeDot={{ r: 4, stroke: "#FF6B6B", strokeWidth: 2, fill: '#fff' }}
                  connectNulls={true}
                />
              )}
              {category === "all" && barChartData[0]?.count !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke={COLORS.default} 
                  name="Transactions" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ fill: COLORS.default, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: COLORS.default, strokeWidth: 2, fill: '#fff' }}
                  connectNulls={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={fullPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, value, type }) => 
                  `${name}: ₹${value.toLocaleString()}`
                }
                labelLine={true}
              >
                {fullPieData.map((entry, index) => (
                  <Cell key={index} fill={getColor(entry)} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Breakdown */}
      {category === "all" && pieData.length > 0 && (
        <div className="category-breakdown">
          <h3>Expense Breakdown by Category</h3>
          <div className="category-list">
            {pieData.map((item, index) => (
              <div key={index} className="category-item" style={{ borderLeftColor: getExpenseColor(item.name) }}>
                <div className="category-info">
                  <span className="category-name">{item.name}</span>
                  <span className="category-amount">₹{item.value.toLocaleString()}</span>
                </div>
                <div className="category-percentage" style={{ backgroundColor: getExpenseColor(item.name) }}>
                  {((item.value / totalExpenses) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
