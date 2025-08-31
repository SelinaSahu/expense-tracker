import React, { useEffect, useState, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";

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

  const dailyData = {};
  filteredExpenses.forEach(exp => {
    const day = exp.date.toISOString().split("T")[0];
    if (!dailyData[day]) dailyData[day] = 0;
    dailyData[day] += exp.amount;
  });

  const histogramData = Object.keys(dailyData).sort().map(date => ({
    date,
    expense: dailyData[date]
  }));

  const pieData = [
    { name: "Income", value: income },
    { name: "Total Expenses", value: filteredExpenses.reduce((sum, e) => sum + e.amount, 0) }
  ];

  const COLORS = ["#28a745", "#dc3545"];

  const handleExport = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "report_chart.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const uniqueCategories = ["all", ...new Set(expenses.map(e => e.name.toLowerCase()))];

  return (
    <div style={{ padding: "2rem", width: "100%" }}>
      <h2>Reports (Last 60 Days)</h2>

      {/* Category Filter */}
      <label htmlFor="categorySelect">Filter by Category:</label>
      <select
        id="categorySelect"
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={{ margin: "0.5rem 0 1rem", padding: "8px" }}
      >&nbsp;
        {uniqueCategories.map((cat, index) => (
          <option key={index} value={cat}>{cat.toUpperCase()}</option>
        ))}
      </select>

      {/* Toggle View */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("bar")}>Bar Chart</button>
        <button onClick={() => setView("pie")}>Pie Chart</button>
        <button onClick={handleExport}>Export Chart</button>
      </div>

      {/* Chart Section */}
      <div ref={chartRef} style={{ width: "100%", height: 350 }}>
        {view === "bar" ? (
          <ResponsiveContainer>
            <BarChart data={histogramData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expense" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
