// React App
// File: App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    revenueRange: { min: '', max: '' },
    netIncomeRange: { min: '', max: '' },
  });
  const [sort, setSort] = useState({ field: '', order: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = '8N8rcH4ELi16WYr8FyL0M4yknkwFQeRC';
      const url = `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=8N8rcH4ELi16WYr8FyL0M4yknkwFQeRC`;
      try {
        const response = await axios.get(url);
        console.log("Fetched Data:", response.data); // Debug log
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const applyFilters = () => {
    let filtered = [...data];

    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(row => {
        const date = new Date(row.date);
        const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        return (!start || date >= start) && (!end || date <= end);
      });
    }

    // Filter by revenue range
    if (filters.revenueRange.min || filters.revenueRange.max) {
      filtered = filtered.filter(row => {
        const revenue = row.revenue || 0;
        const min = filters.revenueRange.min ? parseFloat(filters.revenueRange.min) : null;
        const max = filters.revenueRange.max ? parseFloat(filters.revenueRange.max) : null;
        return (!min || revenue >= min) && (!max || revenue <= max);
      });
    }

    // Filter by net income range
    if (filters.netIncomeRange.min || filters.netIncomeRange.max) {
      filtered = filtered.filter(row => {
        const netIncome = row.netIncome || 0;
        const min = filters.netIncomeRange.min ? parseFloat(filters.netIncomeRange.min) : null;
        const max = filters.netIncomeRange.max ? parseFloat(filters.netIncomeRange.max) : null;
        return (!min || netIncome >= min) && (!max || netIncome <= max);
      });
    }

    // Apply sorting
    if (sort.field) {
      filtered.sort((a, b) => {
        const valueA = a[sort.field] || 0;
        const valueB = b[sort.field] || 0;
        return sort.order === 'asc' ? valueA - valueB : valueB - valueA;
      });
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, sort]);

  const handleSort = (field) => {
    setSort({
      field,
      order: sort.field === field && sort.order === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleFilterChange = (key, type, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value,
      },
    }));
  };

  if (!filteredData || filteredData.length === 0) {
    return <div>No data available to display.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Apple Financial Data</h1>

      <div className="filters mb-4">
        <div>
          <label>Date Range:</label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleFilterChange('dateRange', 'start', e.target.value)}
            className="input"
          />
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleFilterChange('dateRange', 'end', e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label>Revenue Range:</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.revenueRange.min}
            onChange={(e) => handleFilterChange('revenueRange', 'min', e.target.value)}
            className="input"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.revenueRange.max}
            onChange={(e) => handleFilterChange('revenueRange', 'max', e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label>Net Income Range:</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.netIncomeRange.min}
            onChange={(e) => handleFilterChange('netIncomeRange', 'min', e.target.value)}
            className="input"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.netIncomeRange.max}
            onChange={(e) => handleFilterChange('netIncomeRange', 'max', e.target.value)}
            className="input"
          />
        </div>
      </div>

      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th onClick={() => handleSort('date')}>Date</th>
            <th onClick={() => handleSort('revenue')}>Revenue</th>
            <th onClick={() => handleSort('netIncome')}>Net Income</th>
            <th>Gross Profit</th>
            <th>EPS</th>
            <th onClick={() => handleSort('operatingIncome')}>Operating Income</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{row.revenue}</td>
              <td>{row.netIncome}</td>
              <td>{row.grossProfit}</td>
              <td>{row.eps}</td>
              <td>{row.operatingIncome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
