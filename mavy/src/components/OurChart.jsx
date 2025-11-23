export default function OurChart() {
  return (
    <>
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Stock Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentStock.symbol}
                </h2>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                  {currentStock.name}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-gray-900">
                  ${currentStock.price}
                </span>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    currentStock.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {currentStock.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {currentStock.change >= 0 ? "+" : ""}
                  {currentStock.change} (
                  {currentStock.changePercent >= 0 ? "+" : ""}
                  {currentStock.changePercent}%)
                </span>
                <span className="text-xs text-gray-500">Today</span>
              </div>
            </div>
            <div className="flex gap-2">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedTimeframe === tf
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="h-full relative">
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            <line
              x1="0"
              y1="100"
              x2="1000"
              y2="100"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="200"
              x2="1000"
              y2="200"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="300"
              x2="1000"
              y2="300"
              stroke="#e5e7eb"
              strokeWidth="1"
            />

            {/* Chart path */}
            <path
              d="M 0,150 L 50,130 L 100,140 L 150,110 L 200,125 L 250,145 L 300,115 L 350,120 L 400,180 L 450,250 L 500,210 L 550,200 L 600,230 L 650,190 L 700,210 L 750,225 L 800,215 L 850,205 L 900,220 L 950,210 L 1000,200"
              fill="url(#chartGradient)"
            />
            <path
              d="M 0,150 L 50,130 L 100,140 L 150,110 L 200,125 L 250,145 L 300,115 L 350,120 L 400,180 L 450,250 L 500,210 L 550,200 L 600,230 L 650,190 L 700,210 L 750,225 L 800,215 L 850,205 L 900,220 L 950,210 L 1000,200"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
            />
          </svg>
          <div className="absolute right-2 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-4">
            <span>820</span>
            <span>800</span>
            <span>780</span>
            <span>760</span>
          </div>
        </div>
      </div>
    </>
  );
}
