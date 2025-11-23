import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, BarChart3, Brain, ChevronDown, Plus, RefreshCw } from 'lucide-react';

export default function Header({ activeView, setActiveView }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            setShowSearch(false);
            setSearchQuery('');
        }
    };
    
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">MAVY</h1>
                </div>
                <nav className="flex items-center gap-1 ml-6">
                    <button 
                        onClick={() => setActiveView('dashboard')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            activeView === 'dashboard' 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveView('portfolio')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            activeView === 'portfolio' 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Portfolio
                    </button>
                    <button 
                        onClick={() => setActiveView('analysis')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            activeView === 'analysis' 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Analysis
                    </button>
                    <button 
                        onClick={() => setActiveView('reports')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            activeView === 'reports' 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Reports
                    </button>
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
                        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                placeholder="Enter ticker symbol (e.g., AAPL, MSFT)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                autoFocus
                            />
                            <button
                                onClick={handleSearch}
                                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                            >
                                Add to Watchlist
                            </button>
                        </div>
                    )}
                </div>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <RefreshCw className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-green-700">Market Open</span>
                </div>
            </div>
        </header>
    );
}