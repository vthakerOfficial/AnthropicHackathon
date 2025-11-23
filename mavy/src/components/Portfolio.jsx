import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Download, Plus, Search, ChevronDown, ChevronUp, Info } from 'lucide-react';

const Portfolio = () => {
  const [holdings, setHoldings] = useState([
    { ticker: 'AAPL', name: 'Apple Inc.', quantity: 50, unitCost: 150.00, currentPrice: 189.25, dayChange: 2.34, dayChangePercent: 1.25, sector: 'Technology' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', quantity: 25, unitCost: 750.00, currentPrice: 792.30, dayChange: -1.74, dayChangePercent: -0.22, sector: 'Technology' },
    { ticker: 'TSLA', name: 'Tesla Inc.', quantity: 30, unitCost: 220.00, currentPrice: 242.84, dayChange: 8.23, dayChangePercent: 3.51, sector: 'Automotive' },
    { ticker: 'SPY', name: 'SPDR S&P 500', quantity: 100, unitCost: 440.00, currentPrice: 458.12, dayChange: 3.67, dayChangePercent: 0.81, sector: 'ETF' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', quantity: 40, unitCost: 380.00, currentPrice: 415.50, dayChange: 5.20, dayChangePercent: 1.27, sector: 'Technology' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRow, setExpandedRow] = useState(null);
  const [performancePeriod, setPerformancePeriod] = useState('1D');
  const [allocationView, setAllocationView] = useState('stocks');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Calculate portfolio metrics
  const calculateMetrics = () => {
    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalDayChange = 0;

    holdings.forEach(holding => {
      const costBasis = holding.quantity * holding.unitCost;
      const marketValue = holding.quantity * holding.currentPrice;
      const dayChange = holding.quantity * holding.dayChange;

      totalInvested += costBasis;
      totalCurrentValue += marketValue;
      totalDayChange += dayChange;
    });

    const unrealizedGainLoss = totalCurrentValue - totalInvested;
    const unrealizedGainLossPercent = (unrealizedGainLoss / totalInvested) * 100;
    const dayChangePercent = (totalDayChange / (totalCurrentValue - totalDayChange)) * 100;

    return {
      totalInvested,
      totalCurrentValue,
      unrealizedGainLoss,
      unrealizedGainLossPercent,
      totalDayChange,
      dayChangePercent
    };
  };

  const metrics = calculateMetrics();

  // Calculate allocation data
  const getAllocationData = () => {
    if (allocationView === 'stocks') {
      return holdings.map(holding => ({
        name: holding.ticker,
        value: holding.quantity * holding.currentPrice,
        percent: ((holding.quantity * holding.currentPrice) / metrics.totalCurrentValue) * 100
      }));
    } else {
      // Group by sector
      const sectorMap = {};
      holdings.forEach(holding => {
        const value = holding.quantity * holding.currentPrice;
        if (sectorMap[holding.sector]) {
          sectorMap[holding.sector] += value;
        } else {
          sectorMap[holding.sector] = value;
        }
      });
      return Object.entries(sectorMap).map(([sector, value]) => ({
        name: sector,
        value,
        percent: (value / metrics.totalCurrentValue) * 100
      }));
    }
  };

  const allocationData = getAllocationData();

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue, bValue;
    
    switch(sortConfig.key) {
      case 'ticker':
        aValue = a.ticker;
        bValue = b.ticker;
        break;
      case 'quantity':
        aValue = a.quantity;
        bValue = b.quantity;
        break;
      case 'currentPrice':
        aValue = a.currentPrice;
        bValue = b.currentPrice;
        break;
      case 'marketValue':
        aValue = a.quantity * a.currentPrice;
        bValue = b.quantity * b.currentPrice;
        break;
      case 'dayChange':
        aValue = a.quantity * a.dayChange;
        bValue = b.quantity * b.dayChange;
        break;
      case 'unrealizedGain':
        aValue = (a.quantity * a.currentPrice) - (a.quantity * a.unitCost);
        bValue = (b.quantity * b.currentPrice) - (b.quantity * b.unitCost);
        break;
      case 'costBasis':
        aValue = a.quantity * a.unitCost;
        bValue = b.quantity * b.unitCost;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter holdings
  const filteredHoldings = sortedHoldings.filter(holding => 
    holding.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    holding.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Refresh data
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLastUpdate(new Date());
      setLoading(false);
    }, 1000);
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['Ticker', 'Company', 'Quantity', 'Unit Cost', 'Current Price', 'Market Value', 'Cost Basis', 'Unrealized Gain/Loss', 'Day Change'];
    const rows = holdings.map(h => [
      h.ticker,
      h.name,
      h.quantity,
      h.unitCost.toFixed(2),
      h.currentPrice.toFixed(2),
      (h.quantity * h.currentPrice).toFixed(2),
      (h.quantity * h.unitCost).toFixed(2),
      ((h.quantity * h.currentPrice) - (h.quantity * h.unitCost)).toFixed(2),
      (h.quantity * h.dayChange).toFixed(2)
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.csv';
    a.click();
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: {lastUpdate.toLocaleTimeString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Position
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Value</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">${metrics.totalCurrentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-sm text-gray-500 mt-1">Invested: ${metrics.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Unrealized Gain/Loss</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className={`text-3xl font-bold ${metrics.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.unrealizedGainLoss >= 0 ? '+' : ''}${metrics.unrealizedGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-sm mt-1 flex items-center gap-1 ${metrics.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.unrealizedGainLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {metrics.unrealizedGainLossPercent >= 0 ? '+' : ''}{metrics.unrealizedGainLossPercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Today's Change</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className={`text-3xl font-bold ${metrics.totalDayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.totalDayChange >= 0 ? '+' : ''}${metrics.totalDayChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-sm mt-1 flex items-center gap-1 ${metrics.totalDayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.totalDayChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {metrics.dayChangePercent >= 0 ? '+' : ''}{metrics.dayChangePercent.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Holdings</h2>
                <div className="flex items-center gap-2">
                  {['1D', '1W', '1M', '3M', 'YTD', '1Y'].map(period => (
                    <button
                      key={period}
                      onClick={() => setPerformancePeriod(period)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        performancePeriod === period ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search holdings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th onClick={() => handleSort('ticker')} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                      Ticker {sortConfig.key === 'ticker' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('quantity')} className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                      Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('currentPrice')} className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                      Price {sortConfig.key === 'currentPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('marketValue')} className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                      Market Value {sortConfig.key === 'marketValue' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('dayChange')} className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                      Day Change {sortConfig.key === 'dayChange' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('unrealizedGain')} className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                      Gain/Loss {sortConfig.key === 'unrealizedGain' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHoldings.map((holding) => {
                    const marketValue = holding.quantity * holding.currentPrice;
                    const costBasis = holding.quantity * holding.unitCost;
                    const unrealizedGain = marketValue - costBasis;
                    const unrealizedGainPercent = (unrealizedGain / costBasis) * 100;
                    const dayValueChange = holding.quantity * holding.dayChange;
                    
                    return (
                      <React.Fragment key={holding.ticker}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{holding.ticker}</div>
                              <div className="text-xs text-gray-500">{holding.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                            {holding.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900">${holding.currentPrice.toFixed(2)}</div>
                            <div className={`text-xs ${holding.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {holding.dayChange >= 0 ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                            ${marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`text-sm font-medium ${dayValueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {dayValueChange >= 0 ? '+' : ''}${dayValueChange.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`text-sm font-medium ${unrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {unrealizedGain >= 0 ? '+' : ''}${unrealizedGain.toFixed(2)}
                            </div>
                            <div className={`text-xs ${unrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {unrealizedGainPercent >= 0 ? '+' : ''}{unrealizedGainPercent.toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => setExpandedRow(expandedRow === holding.ticker ? null : holding.ticker)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {expandedRow === holding.ticker ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                        {expandedRow === holding.ticker && (
                          <tr className="bg-gray-50">
                            <td colSpan="7" className="px-6 py-4">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Unit Cost: </span>
                                  <span className="font-medium">${holding.unitCost.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Cost Basis: </span>
                                  <span className="font-medium">${costBasis.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Sector: </span>
                                  <span className="font-medium">{holding.sector}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr className="font-semibold">
                    <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">{holdings.reduce((sum, h) => sum + h.quantity, 0)}</td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">${metrics.totalCurrentValue.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <span className={metrics.totalDayChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {metrics.totalDayChange >= 0 ? '+' : ''}${metrics.totalDayChange.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <span className={metrics.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {metrics.unrealizedGainLoss >= 0 ? '+' : ''}${metrics.unrealizedGainLoss.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Asset Allocation</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setAllocationView('stocks')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    allocationView === 'stocks' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Stocks
                </button>
                <button
                  onClick={() => setAllocationView('sectors')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    allocationView === 'sectors' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sectors
                </button>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="relative w-full aspect-square mb-6">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {allocationData.map((item, index) => {
                  const total = allocationData.reduce((sum, d) => sum + d.value, 0);
                  let cumulativePercent = 0;
                  for (let i = 0; i < index; i++) {
                    cumulativePercent += (allocationData[i].value / total) * 100;
                  }
                  const percent = (item.value / total) * 100;
                  const startAngle = (cumulativePercent / 100) * 360 - 90;
                  const endAngle = ((cumulativePercent + percent) / 100) * 360 - 90;
                  
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 100 + 80 * Math.cos(startRad);
                  const y1 = 100 + 80 * Math.sin(startRad);
                  const x2 = 100 + 80 * Math.cos(endRad);
                  const y2 = 100 + 80 * Math.sin(endRad);
                  
                  const largeArc = percent > 50 ? 1 : 0;
                  
                  return (
                    <g key={index}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={colors[index % colors.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{item.percent.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">${item.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;