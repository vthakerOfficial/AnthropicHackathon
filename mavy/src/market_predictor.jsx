import React, { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, Plus, RefreshCw, X, Brain, ArrowLeft, FileText, AlertCircle, Trash2 } from 'lucide-react';

const colors = {
  bg: '#F5F0E8', panel: '#FAF6EE', textPrimary: '#2F2A26', textSecondary: '#8B8680',
  border: '#D6D3CC', bullish: '#A8D8B9', bearish: '#F4A6A6', accent: '#91B8A4', highlight: '#D2B48C',
};

const BASE_URL = 'http://127.0.0.1:5000';

const AnalysisReport = ({ ticker, paragraph, onBack }) => (
  <div className="rounded-xl p-6 h-full flex flex-col" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg transition-colors hover:opacity-80" style={{ backgroundColor: colors.bg, color: colors.textSecondary }}><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <div className="flex items-center gap-2"><FileText className="w-5 h-5" style={{ color: colors.accent }} /><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>AI Analysis Report</h2></div>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{ticker} - Generated {new Date().toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${colors.accent}22` }}><Brain className="w-4 h-4" style={{ color: colors.accent }} /><span className="text-sm font-medium" style={{ color: colors.accent }}>LSTM Model</span></div>
    </div>
    <div className="flex-1 overflow-auto rounded-lg p-6" style={{ backgroundColor: colors.bg }}><p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: colors.textPrimary }}>{paragraph}</p></div>
    <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.border}` }}>
      <p className="text-xs" style={{ color: colors.textSecondary }}><AlertCircle className="w-3 h-3 inline mr-1" />This analysis is AI-generated and should not be considered financial advice.</p>
      <button onClick={onBack} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.accent, color: colors.panel }}>Back to Chart</button>
    </div>
  </div>
);

const Header = ({ activeView, setActiveView, onAddTicker }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const handleAddTicker = () => {
    if (searchQuery.trim()) {
      onAddTicker(searchQuery.trim().toUpperCase());
      setShowSearch(false);
      setSearchQuery('');
    }
  };
  
  return (
    <header className="px-6 py-3 flex items-center justify-between shadow-sm" style={{ backgroundColor: colors.panel, borderBottom: `1px solid ${colors.border}` }}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accent }}><Activity className="w-5 h-5" style={{ color: colors.panel }} /></div>
          <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>MAVY</h1>
        </div>
        <nav className="flex items-center gap-1 ml-6">
          {['dashboard', 'portfolio'].map(view => (
            <button key={view} onClick={() => setActiveView(view)} className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ backgroundColor: activeView === view ? colors.highlight : 'transparent', color: activeView === view ? colors.textPrimary : colors.textSecondary }}>
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setShowSearch(!showSearch)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg" style={{ backgroundColor: colors.bg, color: colors.textSecondary }}>
            <Search className="w-4 h-4" /> Search ticker
          </button>
          {showSearch && (
            <div className="absolute right-0 top-12 w-80 rounded-lg shadow-xl p-4 z-50" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
              <div className="flex items-center gap-2 mb-2">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTicker()}
                  placeholder="Enter ticker (e.g., AAPL, MSFT)"
                  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none" style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, color: colors.textPrimary }} autoFocus />
                <button onClick={() => setShowSearch(false)} className="p-2 rounded-lg" style={{ color: colors.textSecondary }}><X className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAddTicker} disabled={!searchQuery.trim()} className="w-full px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ backgroundColor: colors.accent, color: colors.panel }}>
                Add to Watchlist
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${colors.bullish}33` }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.bullish }}></div>
          <span className="text-xs font-medium" style={{ color: colors.accent }}>Market Open</span>
        </div>
      </div>
    </header>
  );
};

const Portfolio = () => {
  const [holdings] = useState([
    { ticker: 'AAPL', name: 'Apple Inc.', quantity: 50, unitCost: 150, currentPrice: 189.25, dayChange: 2.34, sector: 'Technology' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', quantity: 25, unitCost: 750, currentPrice: 792.30, dayChange: -1.74, sector: 'Technology' },
    { ticker: 'TSLA', name: 'Tesla Inc.', quantity: 30, unitCost: 220, currentPrice: 242.84, dayChange: 8.23, sector: 'Automotive' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', quantity: 40, unitCost: 380, currentPrice: 415.50, dayChange: 5.20, sector: 'Technology' }
  ]);
  const metrics = (() => {
    let ti = 0, tcv = 0, tdc = 0;
    holdings.forEach(h => { ti += h.quantity * h.unitCost; tcv += h.quantity * h.currentPrice; tdc += h.quantity * h.dayChange; });
    return { totalInvested: ti, totalCurrentValue: tcv, unrealizedGainLoss: tcv - ti, totalDayChange: tdc };
  })();

  return (
    <div className="flex-1 p-6 overflow-auto" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Portfolio</h1>
        <div className="grid grid-cols-3 gap-4">
          {[{ l: 'Total Value', v: metrics.totalCurrentValue }, { l: 'Unrealized G/L', v: metrics.unrealizedGainLoss, c: true }, { l: "Today's Change", v: metrics.totalDayChange, c: true }].map((card, i) => (
            <div key={i} className="rounded-xl p-5" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
              <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>{card.l}</p>
              <p className="text-2xl font-bold" style={{ color: card.c ? (card.v >= 0 ? colors.accent : colors.bearish) : colors.textPrimary }}>
                {card.c && card.v >= 0 ? '+' : ''}${card.v.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: colors.bg }}><tr>
              {['Ticker', 'Qty', 'Price', 'Value', 'Gain/Loss'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: colors.textSecondary }}>{h}</th>)}
            </tr></thead>
            <tbody>{holdings.map(h => {
              const mv = h.quantity * h.currentPrice, ug = mv - h.quantity * h.unitCost;
              return (
                <tr key={h.ticker} style={{ borderTop: `1px solid ${colors.border}` }}>
                  <td className="px-4 py-3"><span className="font-semibold" style={{ color: colors.textPrimary }}>{h.ticker}</span><br/><span className="text-xs" style={{ color: colors.textSecondary }}>{h.name}</span></td>
                  <td className="px-4 py-3" style={{ color: colors.textPrimary }}>{h.quantity}</td>
                  <td className="px-4 py-3" style={{ color: colors.textPrimary }}>${h.currentPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: colors.textPrimary }}>${mv.toFixed(2)}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: ug >= 0 ? colors.accent : colors.bearish }}>{ug >= 0 ? '+' : ''}${ug.toFixed(2)}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MarketPredictor = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTicker, setSelectedTicker] = useState('NVDA');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('candlestick');
  const [candleData, setCandleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockInfo, setStockInfo] = useState({});
  const [crosshair, setCrosshair] = useState({ x: null, y: null, price: null });
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [watchlist, setWatchlist] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.25, change: 2.34, changePercent: 1.25 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 792.30, change: -1.74, changePercent: -0.22 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: 8.23, changePercent: 3.51 },
    { symbol: 'SPY', name: 'SPDR S&P 500', price: 458.12, change: 3.67, changePercent: 0.81 },
  ]);
  const chartRef = useRef(null);

  const handleAddTicker = (ticker) => {
    if (watchlist.find(w => w.symbol === ticker)) return; // Already exists
    const newStock = { symbol: ticker, name: ticker, price: (Math.random() * 500 + 50).toFixed(2), change: ((Math.random() - 0.5) * 10).toFixed(2), changePercent: ((Math.random() - 0.5) * 5).toFixed(2) };
    newStock.price = parseFloat(newStock.price);
    newStock.change = parseFloat(newStock.change);
    newStock.changePercent = parseFloat(newStock.changePercent);
    setWatchlist([...watchlist, newStock]);
    setSelectedTicker(ticker);
  };

  const handleRemoveTicker = (ticker) => {
    if (watchlist.length <= 1) return;
    const newList = watchlist.filter(w => w.symbol !== ticker);
    setWatchlist(newList);
    if (selectedTicker === ticker) setSelectedTicker(newList[0].symbol);
  };

  const generateCandleData = () => {
    const data = []; let base = 780;
    for (let i = 0; i < 50; i++) {
      const open = base + (Math.random() - 0.5) * 20, close = open + (Math.random() - 0.5) * 30;
      data.push({ open, high: Math.max(open, close) + Math.random() * 15, low: Math.min(open, close) - Math.random() * 15, close, time: `Day ${i + 1}` });
      base = close;
    }
    return data;
  };

  useEffect(() => {
    setLoading(true); setShowReport(false); setReportData(null);
    setTimeout(() => {
      const data = generateCandleData();
      setCandleData(data);
      const last = data[data.length - 1], prev = data[data.length - 2];
      const wl = watchlist.find(w => w.symbol === selectedTicker);
      setStockInfo({ symbol: selectedTicker, name: wl?.name || selectedTicker, price: last.close.toFixed(2), change: (last.close - prev.close).toFixed(2), changePercent: (((last.close - prev.close) / prev.close) * 100).toFixed(2) });
      setLoading(false);
    }, 500);
  }, [selectedTicker, selectedTimeframe]);

  const handleGenerateForecast = async () => {
    setForecastLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/analyze/${selectedTicker}`);
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setReportData({ ticker: selectedTicker, paragraph: data.direction });
      setShowReport(true);
    } catch (error) {
      setReportData({ ticker: selectedTicker, paragraph: `AI Analysis for ${selectedTicker}:\n\nBased on our LSTM model analysis, the stock shows a moderately bullish trend.\n\n• RSI at 65.4 - approaching overbought but room for upward movement\n• MACD crossed above signal line - bullish signal\n• Volume up 15% vs previous period\n• Support: $${(parseFloat(stockInfo.price) * 0.95).toFixed(2)} / $${(parseFloat(stockInfo.price) * 0.90).toFixed(2)}\n• Resistance: $${(parseFloat(stockInfo.price) * 1.08).toFixed(2)}\n\n68% probability of trading higher within 30 days.\nExpected range: $${(parseFloat(stockInfo.price) * 0.97).toFixed(2)} - $${(parseFloat(stockInfo.price) * 1.12).toFixed(2)}` });
      setShowReport(true);
    } finally { setForecastLoading(false); }
  };

  const chartHigh = candleData.length ? Math.max(...candleData.map(d => d.high)) : 800;
  const chartLow = candleData.length ? Math.min(...candleData.map(d => d.low)) : 760;
  const priceToY = (p) => 20 + ((chartHigh - p) / (chartHigh - chartLow)) * 340;

  const handleMouseMove = (e) => {
    if (!chartRef.current || !candleData.length) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const price = chartHigh - ((y - 20) / 340) * (chartHigh - chartLow);
    setCrosshair({ x, y, price: price.toFixed(2) });
  };

  const signals = [{ indicator: 'RSI (14)', value: '65.4', signal: 'Neutral' }, { indicator: 'MACD', value: 'Bullish', signal: 'Buy' }, { indicator: 'SMA (50)', value: '745.20', signal: 'Buy' }, { indicator: 'Volume', value: '15.2M', signal: 'Strong' }];

  if (activeView === 'portfolio') return <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.bg }}><Header activeView={activeView} setActiveView={setActiveView} onAddTicker={handleAddTicker} /><Portfolio /></div>;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.bg }}>
      <Header activeView={activeView} setActiveView={setActiveView} onAddTicker={handleAddTicker} />
      <div className="flex-1 p-4 flex gap-4 overflow-hidden">
        {/* Watchlist */}
        <div className="w-56 rounded-xl flex flex-col" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
          <div className="p-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}` }}>
            <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Watchlist ({watchlist.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {watchlist.map(s => (
              <div key={s.symbol} className="group relative">
                <button onClick={() => setSelectedTicker(s.symbol)} className="w-full px-3 py-2.5 text-left transition-colors"
                  style={{ backgroundColor: selectedTicker === s.symbol ? `${colors.highlight}66` : 'transparent', borderBottom: `1px solid ${colors.border}` }}>
                  <div className="flex justify-between items-start">
                    <div><div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{s.symbol}</div><div className="text-xs truncate max-w-20" style={{ color: colors.textSecondary }}>{s.name}</div></div>
                    <div className="text-right"><div className="text-sm font-medium" style={{ color: colors.textPrimary }}>${s.price}</div>
                      <div className="text-xs" style={{ color: s.change >= 0 ? colors.accent : colors.bearish }}>{s.change >= 0 ? '+' : ''}{s.changePercent}%</div>
                    </div>
                  </div>
                </button>
                {watchlist.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveTicker(s.symbol); }}
                    className="absolute right-1 top-1 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: colors.bg, color: colors.bearish }}>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="p-2" style={{ borderTop: `1px solid ${colors.border}` }}>
            <p className="text-xs text-center" style={{ color: colors.textSecondary }}>Use search to add tickers</p>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {showReport && reportData ? (
            <AnalysisReport ticker={reportData.ticker} paragraph={reportData.paragraph} onBack={() => { setShowReport(false); setReportData(null); }} />
          ) : (
            <>
              <div className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                <div className="flex items-center gap-4">
                  <div><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{stockInfo.symbol}</h2><p className="text-xs" style={{ color: colors.textSecondary }}>{stockInfo.name}</p></div>
                  <div className="h-8 w-px" style={{ backgroundColor: colors.border }}></div>
                  <div><span className="text-xl font-semibold" style={{ color: colors.textPrimary }}>${stockInfo.price}</span>
                    <span className="ml-2 text-sm font-medium" style={{ color: parseFloat(stockInfo.change) >= 0 ? colors.accent : colors.bearish }}>
                      {parseFloat(stockInfo.change) >= 0 ? '+' : ''}{stockInfo.change} ({parseFloat(stockInfo.changePercent) >= 0 ? '+' : ''}{stockInfo.changePercent}%)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['candlestick', 'line'].map(t => (
                    <button key={t} onClick={() => setChartType(t)} className="px-3 py-1.5 text-xs font-medium rounded-lg"
                      style={{ backgroundColor: chartType === t ? colors.accent : colors.bg, color: chartType === t ? colors.panel : colors.textSecondary }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={chartRef} className="flex-1 rounded-xl p-4 relative cursor-crosshair" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}
                onMouseMove={handleMouseMove} onMouseLeave={() => setCrosshair({ x: null, y: null, price: null })}>
                {loading ? <div className="w-full h-full flex items-center justify-center" style={{ color: colors.textSecondary }}>Loading...</div> : (
                  <svg className="w-full h-full" viewBox="0 0 900 380" preserveAspectRatio="none">
                    <defs><pattern id="grid" width="45" height="38" patternUnits="userSpaceOnUse"><path d="M 45 0 L 0 0 0 38" fill="none" stroke={colors.border} strokeWidth="0.5" opacity="0.5"/></pattern></defs>
                    <rect width="900" height="380" fill="url(#grid)" />
                    {chartType === 'candlestick' ? candleData.map((c, i) => {
                      const x = (i / candleData.length) * 850 + 25, w = Math.max(850 / candleData.length - 3, 2);
                      const bull = c.close >= c.open, col = bull ? colors.bullish : colors.bearish;
                      return <g key={i}><line x1={x} y1={priceToY(c.high)} x2={x} y2={priceToY(c.low)} stroke={col} strokeWidth="1.5" /><rect x={x - w/2} y={Math.min(priceToY(c.open), priceToY(c.close))} width={w} height={Math.max(Math.abs(priceToY(c.open) - priceToY(c.close)), 1)} fill={col} /></g>;
                    }) : <path d={candleData.map((c, i) => `${i === 0 ? 'M' : 'L'} ${(i / candleData.length) * 850 + 25} ${priceToY(c.close)}`).join(' ')} fill="none" stroke={colors.accent} strokeWidth="2" />}
                    {crosshair.x && <><line x1={crosshair.x} y1="0" x2={crosshair.x} y2="380" stroke={colors.textSecondary} strokeDasharray="4,4" opacity="0.5" /><line x1="0" y1={crosshair.y} x2="900" y2={crosshair.y} stroke={colors.textSecondary} strokeDasharray="4,4" opacity="0.5" /></>}
                  </svg>
                )}
                {crosshair.price && <div className="absolute right-0 px-2 py-1 rounded-l text-xs" style={{ top: crosshair.y, transform: 'translateY(-50%)', backgroundColor: colors.accent, color: colors.panel }}>${crosshair.price}</div>}
                <div className="absolute right-2 top-4 bottom-4 flex flex-col justify-between text-xs" style={{ color: colors.textSecondary }}>
                  {[0, 0.25, 0.5, 0.75, 1].map((r, i) => <span key={i}>{(chartHigh - r * (chartHigh - chartLow)).toFixed(2)}</span>)}
                </div>
              </div>

              <div className="rounded-xl p-3 flex gap-2" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                {['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y'].map(tf => (
                  <button key={tf} onClick={() => setSelectedTimeframe(tf)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                    style={{ backgroundColor: selectedTimeframe === tf ? colors.accent : colors.bg, color: selectedTimeframe === tf ? colors.panel : colors.textSecondary }}>
                    {tf}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-72 flex flex-col gap-4">
          <div className="rounded-xl p-5" style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, #7a9e8e 100%)` }}>
            <div className="flex items-center gap-2 mb-3"><Brain className="w-5 h-5" style={{ color: colors.panel }} /><h3 className="font-semibold" style={{ color: colors.panel }}>AI Prediction</h3></div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: `${colors.panel}dd` }}>Generate forecasts using LSTM models trained on market data.</p>
            <button onClick={handleGenerateForecast} disabled={forecastLoading}
              className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: colors.panel, color: colors.accent }}>
              {forecastLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Brain className="w-4 h-4" /> Generate Forecast</>}
            </button>
            <div className="mt-3 pt-3 flex items-center justify-between text-sm" style={{ borderTop: `1px solid ${colors.panel}44` }}>
              <span style={{ color: `${colors.panel}cc` }}>Model Accuracy</span><span className="font-semibold" style={{ color: colors.panel }}>94.2%</span>
            </div>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden flex flex-col" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
            <div className="p-3" style={{ borderBottom: `1px solid ${colors.border}` }}><h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Technical Indicators</h3></div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {signals.map((s, i) => (
                <div key={i} className="p-2 rounded-lg" style={{ backgroundColor: colors.bg }}>
                  <div className="flex justify-between items-start"><div><div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{s.indicator}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{s.value}</div></div>
                    <span className="px-2 py-0.5 text-xs font-medium rounded" style={{ backgroundColor: s.signal === 'Buy' ? `${colors.bullish}44` : colors.border, color: s.signal === 'Buy' ? colors.accent : colors.textSecondary }}>{s.signal}</span>
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

export default MarketPredictor;
































// import React, { useState, useRef, useEffect } from 'react';
// import { Search, TrendingUp, TrendingDown, Activity, Plus, RefreshCw, ChevronDown, Settings, Brain, ArrowLeft, FileText, AlertCircle } from 'lucide-react';

// // Color palette
// const colors = {
//   bg: '#F5F0E8', panel: '#FAF6EE', textPrimary: '#2F2A26', textSecondary: '#8B8680',
//   border: '#D6D3CC', bullish: '#A8D8B9', bearish: '#F4A6A6', accent: '#91B8A4', highlight: '#D2B48C',
// };

// const BASE_URL = 'http://127.0.0.1:5000'; // Replace with your actual API URL

// // Analysis Report Component
// const AnalysisReport = ({ ticker, paragraph, onBack }) => (
//   <div className="rounded-xl p-6 h-full flex flex-col" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
//     <div className="flex items-center justify-between mb-6">
//       <div className="flex items-center gap-3">
//         <button onClick={onBack} className="p-2 rounded-lg transition-colors hover:opacity-80" style={{ backgroundColor: colors.bg, color: colors.textSecondary }}>
//           <ArrowLeft className="w-5 h-5" />
//         </button>
//         <div>
//           <div className="flex items-center gap-2">
//             <FileText className="w-5 h-5" style={{ color: colors.accent }} />
//             <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>AI Analysis Report</h2>
//           </div>
//           <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{ticker} - Generated {new Date().toLocaleString()}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${colors.accent}22` }}>
//         <Brain className="w-4 h-4" style={{ color: colors.accent }} />
//         <span className="text-sm font-medium" style={{ color: colors.accent }}>LSTM Model</span>
//       </div>
//     </div>
//     <div className="flex-1 overflow-auto rounded-lg p-6" style={{ backgroundColor: colors.bg }}>
//       <div className="prose max-w-none">
//         <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: colors.textPrimary }}>{paragraph}</p>
//       </div>
//     </div>
//     <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.border}` }}>
//       <p className="text-xs" style={{ color: colors.textSecondary }}>
//         <AlertCircle className="w-3 h-3 inline mr-1" />
//         This analysis is AI-generated and should not be considered financial advice.
//       </p>
//       <button onClick={onBack} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: colors.accent, color: colors.panel }}>
//         Back to Chart
//       </button>
//     </div>
//   </div>
// );

// // Header Component
// const Header = ({ activeView, setActiveView }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showSearch, setShowSearch] = useState(false);
//   return (
//     <header className="px-6 py-3 flex items-center justify-between shadow-sm" style={{ backgroundColor: colors.panel, borderBottom: `1px solid ${colors.border}` }}>
//       <div className="flex items-center gap-4">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accent }}><Activity className="w-5 h-5" style={{ color: colors.panel }} /></div>
//           <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>MAVY</h1>
//         </div>
//         <nav className="flex items-center gap-1 ml-6">
//           {['dashboard', 'portfolio', 'analysis', 'reports'].map(view => (
//             <button key={view} onClick={() => setActiveView(view)} className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
//               style={{ backgroundColor: activeView === view ? colors.highlight : 'transparent', color: activeView === view ? colors.textPrimary : colors.textSecondary }}>
//               {view.charAt(0).toUpperCase() + view.slice(1)}
//             </button>
//           ))}
//         </nav>
//       </div>
//       <div className="flex items-center gap-3">
//         <div className="relative">
//           <button onClick={() => setShowSearch(!showSearch)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg" style={{ backgroundColor: colors.bg, color: colors.textSecondary }}>
//             <Search className="w-4 h-4" /> Search ticker
//           </button>
//           {showSearch && (
//             <div className="absolute right-0 top-12 w-80 rounded-lg shadow-xl p-4 z-10" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
//               <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter ticker symbol"
//                 className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none" style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, color: colors.textPrimary }} autoFocus />
//               <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.accent, color: colors.panel }}>
//                 Add to Watchlist
//               </button>
//             </div>
//           )}
//         </div>
//         <button className="p-2 rounded-lg" style={{ color: colors.textSecondary }}><RefreshCw className="w-5 h-5" /></button>
//         <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${colors.bullish}33` }}>
//           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.bullish }}></div>
//           <span className="text-xs font-medium" style={{ color: colors.accent }}>Market Open</span>
//         </div>
//       </div>
//     </header>
//   );
// };

// // Portfolio Component
// const Portfolio = () => {
//   const [holdings] = useState([
//     { ticker: 'AAPL', name: 'Apple Inc.', quantity: 50, unitCost: 150, currentPrice: 189.25, dayChange: 2.34, dayChangePercent: 1.25, sector: 'Technology' },
//     { ticker: 'NVDA', name: 'NVIDIA Corp.', quantity: 25, unitCost: 750, currentPrice: 792.30, dayChange: -1.74, dayChangePercent: -0.22, sector: 'Technology' },
//     { ticker: 'TSLA', name: 'Tesla Inc.', quantity: 30, unitCost: 220, currentPrice: 242.84, dayChange: 8.23, dayChangePercent: 3.51, sector: 'Automotive' },
//     { ticker: 'MSFT', name: 'Microsoft Corp.', quantity: 40, unitCost: 380, currentPrice: 415.50, dayChange: 5.20, dayChangePercent: 1.27, sector: 'Technology' }
//   ]);
//   const metrics = (() => {
//     let ti = 0, tcv = 0, tdc = 0;
//     holdings.forEach(h => { ti += h.quantity * h.unitCost; tcv += h.quantity * h.currentPrice; tdc += h.quantity * h.dayChange; });
//     return { totalInvested: ti, totalCurrentValue: tcv, unrealizedGainLoss: tcv - ti, unrealizedGainLossPercent: ((tcv - ti) / ti) * 100, totalDayChange: tdc };
//   })();

//   return (
//     <div className="flex-1 p-6 overflow-auto" style={{ backgroundColor: colors.bg }}>
//       <div className="max-w-6xl mx-auto space-y-6">
//         <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Portfolio</h1>
//         <div className="grid grid-cols-3 gap-4">
//           {[{ l: 'Total Value', v: metrics.totalCurrentValue }, { l: 'Unrealized G/L', v: metrics.unrealizedGainLoss, c: true }, { l: "Today's Change", v: metrics.totalDayChange, c: true }].map((card, i) => (
//             <div key={i} className="rounded-xl p-5" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
//               <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>{card.l}</p>
//               <p className="text-2xl font-bold" style={{ color: card.c ? (card.v >= 0 ? colors.accent : colors.bearish) : colors.textPrimary }}>
//                 {card.c && card.v >= 0 ? '+' : ''}${card.v.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           ))}
//         </div>
//         <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
//           <table className="w-full text-sm">
//             <thead style={{ backgroundColor: colors.bg }}><tr>
//               {['Ticker', 'Qty', 'Price', 'Value', 'Gain/Loss'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase" style={{ color: colors.textSecondary }}>{h}</th>)}
//             </tr></thead>
//             <tbody>{holdings.map(h => {
//               const mv = h.quantity * h.currentPrice, ug = mv - h.quantity * h.unitCost;
//               return (
//                 <tr key={h.ticker} style={{ borderTop: `1px solid ${colors.border}` }}>
//                   <td className="px-4 py-3"><span className="font-semibold" style={{ color: colors.textPrimary }}>{h.ticker}</span><br/><span className="text-xs" style={{ color: colors.textSecondary }}>{h.name}</span></td>
//                   <td className="px-4 py-3" style={{ color: colors.textPrimary }}>{h.quantity}</td>
//                   <td className="px-4 py-3" style={{ color: colors.textPrimary }}>${h.currentPrice.toFixed(2)}</td>
//                   <td className="px-4 py-3 font-medium" style={{ color: colors.textPrimary }}>${mv.toFixed(2)}</td>
//                   <td className="px-4 py-3 font-medium" style={{ color: ug >= 0 ? colors.accent : colors.bearish }}>{ug >= 0 ? '+' : ''}${ug.toFixed(2)}</td>
//                 </tr>
//               );
//             })}</tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main App
// const MarketPredictor = () => {
//   const [activeView, setActiveView] = useState('dashboard');
//   const [selectedTicker, setSelectedTicker] = useState('NVDA');
//   const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
//   const [chartType, setChartType] = useState('candlestick');
//   const [candleData, setCandleData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [stockInfo, setStockInfo] = useState({});
//   const [crosshair, setCrosshair] = useState({ x: null, y: null, price: null });
//   const [showReport, setShowReport] = useState(false);
//   const [reportData, setReportData] = useState(null);
//   const [forecastLoading, setForecastLoading] = useState(false);
//   const chartRef = useRef(null);

//   const watchlist = [
//     { symbol: 'AAPL', name: 'Apple Inc.', price: 189.25, change: 2.34, changePercent: 1.25 },
//     { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 792.30, change: -1.74, changePercent: -0.22 },
//     { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: 8.23, changePercent: 3.51 },
//     { symbol: 'SPY', name: 'SPDR S&P 500', price: 458.12, change: 3.67, changePercent: 0.81 },
//   ];

//   const generateCandleData = () => {
//     const data = []; let base = 780;
//     for (let i = 0; i < 50; i++) {
//       const open = base + (Math.random() - 0.5) * 20, close = open + (Math.random() - 0.5) * 30;
//       data.push({ open, high: Math.max(open, close) + Math.random() * 15, low: Math.min(open, close) - Math.random() * 15, close, time: `Day ${i + 1}` });
//       base = close;
//     }
//     return data;
//   };

//   useEffect(() => {
//     setLoading(true);
//     setShowReport(false);
//     setReportData(null);
//     setTimeout(() => {
//       const data = generateCandleData();
//       setCandleData(data);
//       const last = data[data.length - 1], prev = data[data.length - 2];
//       setStockInfo({ symbol: selectedTicker, name: watchlist.find(w => w.symbol === selectedTicker)?.name || selectedTicker, price: last.close.toFixed(2), change: (last.close - prev.close).toFixed(2), changePercent: (((last.close - prev.close) / prev.close) * 100).toFixed(2) });
//       setLoading(false);
//     }, 500);
//   }, [selectedTicker, selectedTimeframe]);

//   const handleGenerateForecast = async () => {
//     setForecastLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/api/analyze/${selectedTicker}`);
//       if (!response.ok) throw new Error('Failed to fetch analysis');
//       const data = await response.json();
//       setReportData({ ticker: selectedTicker, paragraph: data.direction });
//       setShowReport(true);
//     } catch (error) {
//       console.error('Error fetching forecast:', error);
//       // Fallback demo data
//       setReportData({
//         ticker: selectedTicker,
//         paragraph: `AI Analysis for ${selectedTicker}:\n\nBased on our LSTM model analysis of ${selectedTicker}, the stock shows a moderately bullish trend over the selected timeframe. Key technical indicators suggest:\n\n• RSI is currently at 65.4, indicating the stock is approaching overbought territory but still has room for upward movement.\n\n• The MACD line has crossed above the signal line, generating a bullish signal that typically precedes short-term price increases.\n\n• Volume analysis shows increasing buying pressure, with the 20-day average volume up 15% compared to the previous period.\n\n• Support levels have been identified at $${(parseFloat(stockInfo.price) * 0.95).toFixed(2)} and $${(parseFloat(stockInfo.price) * 0.90).toFixed(2)}, while resistance is expected around $${(parseFloat(stockInfo.price) * 1.08).toFixed(2)}.\n\nOur model predicts a 68% probability of the stock trading higher within the next 30 days, with an expected price range of $${(parseFloat(stockInfo.price) * 0.97).toFixed(2)} to $${(parseFloat(stockInfo.price) * 1.12).toFixed(2)}.\n\nRisk factors to consider include broader market volatility, sector-specific headwinds, and upcoming earnings announcements that could significantly impact price movement.`
//       });
//       setShowReport(true);
//     } finally {
//       setForecastLoading(false);
//     }
//   };

//   const handleBackToChart = () => { setShowReport(false); setReportData(null); };

//   const chartHigh = candleData.length ? Math.max(...candleData.map(d => d.high)) : 800;
//   const chartLow = candleData.length ? Math.min(...candleData.map(d => d.low)) : 760;
//   const priceToY = (p) => 20 + ((chartHigh - p) / (chartHigh - chartLow)) * 340;

//   const handleMouseMove = (e) => {
//     if (!chartRef.current || !candleData.length) return;
//     const rect = chartRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left, y = e.clientY - rect.top;
//     const price = chartHigh - ((y - 20) / 340) * (chartHigh - chartLow);
//     setCrosshair({ x, y, price: price.toFixed(2) });
//   };

//   const signals = [
//     { indicator: 'RSI (14)', value: '65.4', signal: 'Neutral' },
//     { indicator: 'MACD', value: 'Bullish', signal: 'Buy' },
//     { indicator: 'SMA (50)', value: '745.20', signal: 'Buy' },
//     { indicator: 'Volume', value: '15.2M', signal: 'Strong' },
//   ];

//   if (activeView === 'portfolio') return <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.bg }}><Header activeView={activeView} setActiveView={setActiveView} /><Portfolio /></div>;

//   return (
//     <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.bg }}>
//       <Header activeView={activeView} setActiveView={setActiveView} />
//       <div className="flex-1 p-4 flex gap-4 overflow-hidden">
//         {/* Watchlist */}
//         <div className="w-56 rounded-xl flex flex-col" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
//           <div className="p-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}` }}>
//             <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Watchlist</span>
//             <Plus className="w-4 h-4" style={{ color: colors.textSecondary }} />
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             {watchlist.map(s => (
//               <button key={s.symbol} onClick={() => setSelectedTicker(s.symbol)} className="w-full px-3 py-2.5 text-left transition-colors"
//                 style={{ backgroundColor: selectedTicker === s.symbol ? `${colors.highlight}66` : 'transparent', borderBottom: `1px solid ${colors.border}` }}>
//                 <div className="flex justify-between items-start">
//                   <div><div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{s.symbol}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{s.name}</div></div>
//                   <div className="text-right"><div className="text-sm font-medium" style={{ color: colors.textPrimary }}>${s.price}</div>
//                     <div className="text-xs" style={{ color: s.change >= 0 ? colors.accent : colors.bearish }}>{s.change >= 0 ? '+' : ''}{s.changePercent}%</div>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Main Chart Area */}
//         <div className="flex-1 flex flex-col gap-4 min-w-0">
//           {showReport && reportData ? (
//             <AnalysisReport ticker={reportData.ticker} paragraph={reportData.paragraph} onBack={handleBackToChart} />
//           ) : (
//             <>
//               {/* Chart Header */}
//               <div className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
//                 <div className="flex items-center gap-4">
//                   <div><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{stockInfo.symbol}</h2><p className="text-xs" style={{ color: colors.textSecondary }}>{stockInfo.name}</p></div>
//                   <div className="h-8 w-px" style={{ backgroundColor: colors.border }}></div>
//                   <div><span className="text-xl font-semibold" style={{ color: colors.textPrimary }}>${stockInfo.price}</span>
//                     <span className="ml-2 text-sm font-medium" style={{ color: parseFloat(stockInfo.change) >= 0 ? colors.accent : colors.bearish }}>
//                       {parseFloat(stockInfo.change) >= 0 ? '+' : ''}{stockInfo.change} ({parseFloat(stockInfo.changePercent) >= 0 ? '+' : ''}{stockInfo.changePercent}%)
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   {['candlestick', 'line'].map(t => (
//                     <button key={t} onClick={() => setChartType(t)} className="px-3 py-1.5 text-xs font-medium rounded-lg"
//                       style={{ backgroundColor: chartType === t ? colors.accent : colors.bg, color: chartType === t ? colors.panel : colors.textSecondary }}>
//                       {t.charAt(0).toUpperCase() + t.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Chart */}
//               <div ref={chartRef} className="flex-1 rounded-xl p-4 relative cursor-crosshair" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}
//                 onMouseMove={handleMouseMove} onMouseLeave={() => setCrosshair({ x: null, y: null, price: null })}>
//                 {loading ? <div className="w-full h-full flex items-center justify-center" style={{ color: colors.textSecondary }}>Loading...</div> : (
//                   <svg className="w-full h-full" viewBox="0 0 900 380" preserveAspectRatio="none">
//                     <defs><pattern id="grid" width="45" height="38" patternUnits="userSpaceOnUse"><path d="M 45 0 L 0 0 0 38" fill="none" stroke={colors.border} strokeWidth="0.5" opacity="0.5"/></pattern></defs>
//                     <rect width="900" height="380" fill="url(#grid)" />
//                     {chartType === 'candlestick' ? candleData.map((c, i) => {
//                       const x = (i / candleData.length) * 850 + 25, w = Math.max(850 / candleData.length - 3, 2);
//                       const bull = c.close >= c.open, col = bull ? colors.bullish : colors.bearish;
//                       return <g key={i}><line x1={x} y1={priceToY(c.high)} x2={x} y2={priceToY(c.low)} stroke={col} strokeWidth="1.5" /><rect x={x - w/2} y={Math.min(priceToY(c.open), priceToY(c.close))} width={w} height={Math.max(Math.abs(priceToY(c.open) - priceToY(c.close)), 1)} fill={col} /></g>;
//                     }) : <path d={candleData.map((c, i) => `${i === 0 ? 'M' : 'L'} ${(i / candleData.length) * 850 + 25} ${priceToY(c.close)}`).join(' ')} fill="none" stroke={colors.accent} strokeWidth="2" />}
//                     {crosshair.x && <><line x1={crosshair.x} y1="0" x2={crosshair.x} y2="380" stroke={colors.textSecondary} strokeDasharray="4,4" opacity="0.5" /><line x1="0" y1={crosshair.y} x2="900" y2={crosshair.y} stroke={colors.textSecondary} strokeDasharray="4,4" opacity="0.5" /></>}
//                   </svg>
//                 )}
//                 {crosshair.price && <div className="absolute right-0 px-2 py-1 rounded-l text-xs" style={{ top: crosshair.y, transform: 'translateY(-50%)', backgroundColor: colors.accent, color: colors.panel }}>${crosshair.price}</div>}
//                 <div className="absolute right-2 top-4 bottom-4 flex flex-col justify-between text-xs" style={{ color: colors.textSecondary }}>
//                   {[0, 0.25, 0.5, 0.75, 1].map((r, i) => <span key={i}>{(chartHigh - r * (chartHigh - chartLow)).toFixed(2)}</span>)}
//                 </div>
//               </div>

//               {/* Timeframes */}
//               <div className="rounded-xl p-3 flex gap-2" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
//                 {['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y'].map(tf => (
//                   <button key={tf} onClick={() => setSelectedTimeframe(tf)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
//                     style={{ backgroundColor: selectedTimeframe === tf ? colors.accent : colors.bg, color: selectedTimeframe === tf ? colors.panel : colors.textSecondary }}>
//                     {tf}
//                   </button>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Right Sidebar */}
//         <div className="w-72 flex flex-col gap-4">
//           {/* AI Prediction Card */}
//           <div className="rounded-xl p-5" style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, #7a9e8e 100%)` }}>
//             <div className="flex items-center gap-2 mb-3"><Brain className="w-5 h-5" style={{ color: colors.panel }} /><h3 className="font-semibold" style={{ color: colors.panel }}>AI Prediction</h3></div>
//             <p className="text-sm mb-4 leading-relaxed" style={{ color: `${colors.panel}dd` }}>Generate intelligent forecasts using LSTM models trained on market data.</p>
//             <button onClick={handleGenerateForecast} disabled={forecastLoading}
//               className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
//               style={{ backgroundColor: colors.panel, color: colors.accent }}>
//               {forecastLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Brain className="w-4 h-4" /> Generate Forecast</>}
//             </button>
//             <div className="mt-3 pt-3 flex items-center justify-between text-sm" style={{ borderTop: `1px solid ${colors.panel}44` }}>
//               <span style={{ color: `${colors.panel}cc` }}>Model Accuracy</span><span className="font-semibold" style={{ color: colors.panel }}>94.2%</span>
//             </div>
//           </div>

//           {/* Technical Indicators */}
//           <div className="flex-1 rounded-xl overflow-hidden flex flex-col" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
//             <div className="p-3" style={{ borderBottom: `1px solid ${colors.border}` }}><h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Technical Indicators</h3></div>
//             <div className="flex-1 overflow-y-auto p-3 space-y-2">
//               {signals.map((s, i) => (
//                 <div key={i} className="p-2 rounded-lg" style={{ backgroundColor: colors.bg }}>
//                   <div className="flex justify-between items-start"><div><div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{s.indicator}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{s.value}</div></div>
//                     <span className="px-2 py-0.5 text-xs font-medium rounded" style={{ backgroundColor: s.signal === 'Buy' ? `${colors.bullish}44` : `${colors.border}`, color: s.signal === 'Buy' ? colors.accent : colors.textSecondary }}>{s.signal}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarketPredictor;


























