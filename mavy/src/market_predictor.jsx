import React, { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, Plus, RefreshCw, ChevronDown, Settings, Bell, PlayCircle, PenTool, BarChart3, Brain } from 'lucide-react';

const TradingPlatform = () => {
  const [selectedTicker, setSelectedTicker] = useState('NVDA');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [activeTab, setActiveTab] = useState('trading');
  const [chartType, setChartType] = useState('candlestick');
  const [crosshair, setCrosshair] = useState({ x: null, y: null, price: null, time: null });
  const [candleData, setCandleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockInfo, setStockInfo] = useState({});
  const [watchlistData, setWatchlistData] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.25, change: 2.34, changePercent: 1.25 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 792.30, change: -1.74, changePercent: -0.22 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: 8.23, changePercent: 3.51 },
    { symbol: 'SPY', name: 'SPDR S&P 500', price: 458.12, change: 3.67, changePercent: 0.81 },
    { symbol: 'AMD', name: 'AMD Inc.', price: 147.39, change: -2.21, changePercent: -1.48 }
  ]);
  const chartRef = useRef(null);
  const crosshairTimeout = useRef(null);

  // Fetch quick quote for watchlist items
  const fetchQuickQuote = async (ticker) => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const period1 = now - 86400; // Last day
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${now}&interval=1d`;
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const url = corsProxy + encodeURIComponent(yahooUrl);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.chart?.result?.[0]) {
        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];
        
        const currentPrice = meta.regularMarketPrice || quote.close[quote.close.length - 1];
        const previousClose = meta.previousClose || quote.close[quote.close.length - 2];
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        return {
          symbol: ticker,
          name: meta.longName || meta.shortName || ticker,
          price: parseFloat(currentPrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2))
        };
      }
    } catch (error) {
      console.error(`Error fetching quote for ${ticker}:`, error);
      return null;
    }
  };

  // Update watchlist prices
  const updateWatchlistPrices = async () => {
    const promises = watchlistData.map(stock => fetchQuickQuote(stock.symbol));
    const results = await Promise.all(promises);
    
    const updatedWatchlist = results.map((result, index) => {
      if (result) {
        return result;
      }
      return watchlistData[index];
    });
    
    setWatchlistData(updatedWatchlist);
  };

  // Update watchlist on mount
  useEffect(() => {
    updateWatchlistPrices();
  }, []);

  // Fetch stock data from Yahoo Finance
  const fetchStockData = async (ticker, timeframe) => {
    setLoading(true);
    try {
      // Calculate date range based on timeframe
      const now = Math.floor(Date.now() / 1000);
      let period1;
      const timeframeMap = {
        '1D': now - 86400,
        '5D': now - (86400 * 5),
        '1M': now - (86400 * 30),
        '3M': now - (86400 * 90),
        '6M': now - (86400 * 180),
        'YTD': Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000),
        '1Y': now - (86400 * 365),
        '5Y': now - (86400 * 365 * 5),
        'All': now - (86400 * 365 * 10)
      };
      period1 = timeframeMap[timeframe] || timeframeMap['1M'];

      // Determine interval based on timeframe
      const intervalMap = {
        '1D': '5m',
        '5D': '30m',
        '1M': '1d',
        '3M': '1d',
        '6M': '1d',
        'YTD': '1d',
        '1Y': '1d',
        '5Y': '1wk',
        'All': '1mo'
      };
      const interval = intervalMap[timeframe] || '1d';

      // Use CORS proxy
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${now}&interval=${interval}`;
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const url = corsProxy + encodeURIComponent(yahooUrl);
      
      console.log('Fetching:', ticker, timeframe, 'from', new Date(period1 * 1000).toLocaleDateString(), 'to', new Date(now * 1000).toLocaleDateString());
      
      const response = await fetch(url, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Yahoo Finance Response:', data);
      
      if (data.chart?.result?.[0]) {
        const result = data.chart.result[0];
        const timestamps = result.timestamp || [];
        const quote = result.indicators.quote[0];
        
        if (!timestamps.length || !quote) {
          throw new Error('No data available for this timeframe');
        }
        
        // Process candlestick data
        const processedData = timestamps.map((time, i) => ({
          timestamp: time,
          time: new Date(time * 1000).toLocaleString(),
          open: quote.open[i] || quote.close[i] || 0,
          high: quote.high[i] || quote.close[i] || 0,
          low: quote.low[i] || quote.close[i] || 0,
          close: quote.close[i] || 0,
          volume: quote.volume[i] || 0
        })).filter(d => d.close > 0 && d.high > 0 && d.low > 0); // Filter out invalid data

        if (processedData.length === 0) {
          throw new Error('No valid data points');
        }

        console.log('Processed data points:', processedData.length, 'First:', processedData[0], 'Last:', processedData[processedData.length - 1]);
        
        setCandleData(processedData);

        // Update stock info with current timeframe data
        const meta = result.meta;
        const latestCandle = processedData[processedData.length - 1];
        const previousCandle = processedData[processedData.length - 2];
        
        const currentPrice = latestCandle.close;
        const previousPrice = previousCandle?.close || meta.previousClose || currentPrice;
        const change = currentPrice - previousPrice;
        const changePercent = (change / previousPrice) * 100;

        setStockInfo({
          symbol: ticker,
          price: parseFloat(currentPrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          name: meta.longName || meta.shortName || ticker
        });
      } else {
        throw new Error('No data in response');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      // Fallback to generated data if API fails
      const fallbackData = generateCandlestickData();
      setCandleData(fallbackData);
      
      // Set fallback stock info
      const fallbackStock = watchlistData.find(s => s.symbol === ticker);
      if (fallbackStock) {
        setStockInfo(fallbackStock);
      }
    }
    setLoading(false);
  };

  // Generate fallback data
  const generateCandlestickData = () => {
    const data = [];
    let basePrice = 780;
    for (let i = 0; i < 60; i++) {
      const open = basePrice + (Math.random() - 0.5) * 20;
      const close = open + (Math.random() - 0.5) * 30;
      const high = Math.max(open, close) + Math.random() * 15;
      const low = Math.min(open, close) - Math.random() * 15;
      data.push({ open, high, low, close, time: i });
      basePrice = close;
    }
    return data;
  };

  // Fetch data when ticker or timeframe changes
  useEffect(() => {
    fetchStockData(selectedTicker, selectedTimeframe);
  }, [selectedTicker, selectedTimeframe]);

  // Use real data if available, otherwise fall back to watchlist
  const currentStock = stockInfo.symbol === selectedTicker ? stockInfo : watchlistData.find(s => s.symbol === selectedTicker);
  const timeframes = ['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'All'];
  const chartHigh = candleData.length > 0 ? Math.max(...candleData.map(d => d.high)) : 800;
  const chartLow = candleData.length > 0 ? Math.min(...candleData.map(d => d.low)) : 760;

  const priceToY = (price) => {
    const chartHeight = 400;
    const padding = 20;
    return padding + ((chartHigh - price) / (chartHigh - chartLow)) * (chartHeight - padding * 2);
  };

  const handleChartMouseMove = (e) => {
    if (!chartRef.current) return;
    
    // Clear existing timeout
    if (crosshairTimeout.current) {
      clearTimeout(crosshairTimeout.current);
    }
    
    // Debounce the crosshair update
    crosshairTimeout.current = setTimeout(() => {
      const rect = chartRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dataIndex = Math.floor((x / rect.width) * candleData.length);
      
      if (dataIndex >= 0 && dataIndex < candleData.length) {
        const candle = candleData[dataIndex];
        const price = chartHigh - ((y - 20) / (rect.height - 40)) * (chartHigh - chartLow);
        setCrosshair({ x, y, price: price.toFixed(2), time: dataIndex });
      }
    }, 16); // ~60fps throttling
  };

  const handleChartMouseLeave = () => {
    if (crosshairTimeout.current) {
      clearTimeout(crosshairTimeout.current);
    }
    setCrosshair({ x: null, y: null, price: null, time: null });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (crosshairTimeout.current) {
        clearTimeout(crosshairTimeout.current);
      }
    };
  }, []);

  const signals = [
    { indicator: 'RSI (14)', value: 64.2, signal: 'Neutral', trend: 'down', change: -2.5 },
    { indicator: 'MACD (12, 26)', value: 'Bullish', signal: 'Buy', trend: 'up', change: 5.1 },
    { indicator: 'Bollinger Bands', value: 'Middle', signal: 'Neutral', trend: 'neutral', change: 0 },
    { indicator: 'SMA (50)', value: 'Below', signal: 'Bearish', trend: 'down', change: -3.2 }
  ];

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">AlphaSeeker</h1>
          </div>
          <nav className="flex items-center gap-1 ml-6">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">Trading</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Portfolio</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Analysis</button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              Search ticker
            </button>
            {showSearch && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter ticker symbol (e.g., AAPL, MSFT)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      setShowSearch(false);
                      setSearchQuery('');
                    }
                  }}
                  className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Add to Watchlist
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Market Open</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Left Sidebar - Watchlist */}
        <div className="w-64 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Watchlist</h2>
              <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {watchlistData.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedTicker(stock.symbol)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-l-2 transition-all duration-200 ${
                  selectedTicker === stock.symbol ? 'bg-blue-50 border-blue-600' : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </div>
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-sm font-semibold text-gray-900">${stock.price}</span>
                  <span className={`text-xs font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center - Chart Area */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Chart Toolbar */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{currentStock?.symbol || selectedTicker}</h2>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{currentStock?.name || 'Loading...'}</span>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-gray-900">${currentStock?.price || '0.00'}</span>
                  <span className={`text-sm font-medium flex items-center gap-1 ${(currentStock?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(currentStock?.change || 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {(currentStock?.change || 0) >= 0 ? '+' : ''}{currentStock?.change || '0.00'} ({(currentStock?.changePercent || 0) >= 0 ? '+' : ''}{currentStock?.changePercent || '0.00'}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <PenTool className="w-4 h-4" />
                  Draw
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  Indicators
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <PlayCircle className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Chart Display */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col min-h-0">
            {/* Chart Header Info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-6 text-xs">
                {loading ? (
                  <span className="text-gray-500">Loading data...</span>
                ) : candleData.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">H</span>
                      <span className="font-semibold text-gray-900">{chartHigh.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">L</span>
                      <span className="font-semibold text-gray-900">{chartLow.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">C</span>
                      <span className="font-semibold text-gray-900">{candleData[candleData.length - 1].close.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500">No data available</span>
                )}
              </div>
              
              {/* Chart Type Selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartType('candlestick')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    chartType === 'candlestick' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Candlestick
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    chartType === 'line' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Line
                </button>
              </div>
            </div>

            {/* Chart Container */}
            <div 
              ref={chartRef}
              className="flex-1 relative cursor-crosshair"
              onMouseMove={handleChartMouseMove}
              onMouseLeave={handleChartMouseLeave}
            >
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-500">Loading chart data...</div>
                </div>
              ) : candleData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-500">No data available</div>
                </div>
              ) : (
              <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                
                {/* Grid */}
                <rect width="1000" height="400" fill="url(#grid)" />
                
                {/* Horizontal reference lines */}
                {[0.25, 0.5, 0.75].map((ratio, i) => {
                  const y = 20 + ratio * 360;
                  const price = chartHigh - ratio * (chartHigh - chartLow);
                  return (
                    <g key={i}>
                      <line x1="0" y1={y} x2="950" y2={y} stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4,4" />
                    </g>
                  );
                })}
                
                {chartType === 'candlestick' ? (
                  // Candlesticks
                  candleData.map((candle, i) => {
                    const x = (i / candleData.length) * 950 + 25;
                    const width = Math.max(950 / candleData.length - 2, 2);
                    const openY = priceToY(candle.open);
                    const closeY = priceToY(candle.close);
                    const highY = priceToY(candle.high);
                    const lowY = priceToY(candle.low);
                    const isBullish = candle.close > candle.open;
                    const color = isBullish ? '#10b981' : '#ef4444';
                    const bodyHeight = Math.abs(closeY - openY);
                    
                    return (
                      <g key={i} className="transition-all duration-300 ease-out" style={{ opacity: 0, animation: `fadeIn 0.3s ease-out ${i * 0.01}s forwards` }}>
                        {/* Wick */}
                        <line x1={x + width/2} y1={highY} x2={x + width/2} y2={lowY} stroke={color} strokeWidth="1.5" />
                        {/* Body */}
                        <rect 
                          x={x} 
                          y={Math.min(openY, closeY)} 
                          width={width} 
                          height={Math.max(bodyHeight, 1)} 
                          fill={color}
                          opacity={isBullish ? 1 : 0.8}
                        />
                      </g>
                    );
                  })
                ) : (
                  // Line Chart
                  <>
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Line path */}
                    <path
                      d={candleData.map((candle, i) => {
                        const x = (i / candleData.length) * 950 + 25;
                        const y = priceToY(candle.close);
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out forwards' }}
                    />
                    {/* Area fill */}
                    <path
                      d={`${candleData.map((candle, i) => {
                        const x = (i / candleData.length) * 950 + 25;
                        const y = priceToY(candle.close);
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')} L ${950 + 25} 380 L 25 380 Z`}
                      fill="url(#lineGradient)"
                      style={{ opacity: 0, animation: 'fadeIn 0.5s ease-out forwards' }}
                    />
                  </>
                )}

                {/* Crosshair */}
                {crosshair.x !== null && (
                  <g className="transition-opacity duration-150">
                    <line x1={crosshair.x} y1="0" x2={crosshair.x} y2="400" stroke="#666" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                    <line x1="0" y1={crosshair.y} x2="950" y2={crosshair.y} stroke="#666" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                  </g>
                )}
              </svg>
              )}

              {/* Price Scale */}
              <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 py-5 pr-2">
                <span className="bg-white px-1">{chartHigh.toFixed(2)}</span>
                <span className="bg-white px-1">{(chartHigh - (chartHigh - chartLow) * 0.25).toFixed(2)}</span>
                <span className="bg-white px-1">{((chartHigh + chartLow) / 2).toFixed(2)}</span>
                <span className="bg-white px-1">{(chartLow + (chartHigh - chartLow) * 0.25).toFixed(2)}</span>
                <span className="bg-white px-1">{chartLow.toFixed(2)}</span>
              </div>

              {/* Crosshair price label */}
              {crosshair.price && (
                <div 
                  className="absolute right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-l transition-all duration-150"
                  style={{ top: `${crosshair.y}px`, transform: 'translateY(-50%)' }}
                >
                  ${crosshair.price}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      selectedTimeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('trading')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'trading' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Trading Panel
                  </button>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'editor' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Pine Editor
                  </button>
                </div>
                <span className="text-xs text-gray-500">UTC {new Date().toUTCString().slice(17, 25)}</span>
              </div>
            </div>
            <div className="p-4 h-32">
              {activeTab === 'trading' ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  Trading panel controls will appear here
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  Pine Script editor workspace
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          {/* AI Prediction */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5" />
              <h3 className="font-semibold">AI Prediction</h3>
            </div>
            <p className="text-sm text-blue-100 mb-4 leading-relaxed">
              Generate intelligent forecasts using LSTM models trained on market data and sentiment analysis.
            </p>
            <button className="w-full bg-white text-blue-600 font-semibold py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <Brain className="w-4 h-4" />
              Generate Forecast
            </button>
            <div className="mt-3 pt-3 border-t border-blue-500 flex items-center justify-between text-sm">
              <span className="text-blue-100">Model Accuracy</span>
              <span className="font-semibold">94.2%</span>
            </div>
          </div>

          {/* Technical Signals */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Technical Indicators</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {signals.map((signal, idx) => (
                <div key={idx} className="pb-3 border-b border-gray-100 last:border-0 transition-all duration-200 hover:bg-gray-50 px-2 py-1 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{signal.indicator}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Value: {signal.value}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      signal.signal === 'Buy' || signal.signal === 'Bullish' 
                        ? 'bg-green-100 text-green-700'
                        : signal.signal === 'Bearish'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {signal.signal}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {signal.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
                    {signal.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600" />}
                    <span className={`text-xs font-medium ${
                      signal.change > 0 ? 'text-green-600' : signal.change < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {signal.change !== 0 && (signal.change > 0 ? '+' : '')}{signal.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TradingPlatform;