import React, { useEffect, useState, useMemo } from "react";
import AppLayout from '../../Layouts/AppLayout';
import TabNavigation from '../../Components/TabNavigation';

function ScrambleText({
    text,
    duration = 1200,
    scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
}) {
    const [display, setDisplay] = useState(text);
    useEffect(() => {
        let frame = 0;
        let revealed = Array(text.length).fill(false);
        let interval = setInterval(() => {
            let newText = text
                .split("")
                .map((char, i) => {
                    if (revealed[i]) return char;
                    if (Math.random() < frame / (duration / 10)) {
                        revealed[i] = true;
                        return char;
                    }
                    return scrambleChars[
                        Math.floor(Math.random() * scrambleChars.length)
                    ];
                })
                .join("");
            setDisplay(newText);
            frame++;
            if (revealed.every(Boolean)) clearInterval(interval);
        }, 40);
        return () => clearInterval(interval);
    }, [text, duration, scrambleChars]);
    return <span style={{ color: '#FFE81F', fontFamily: 'Montserrat, Arial, sans-serif' }}>{display}</span>;
}

function StarBackground({ count = 100 }) {
    const colors = ["#fff", "#b3e5fc", "#ffe082"];
    const stars = useMemo(
        () =>
            Array.from({ length: count }).map((_, i) => {
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                const size = Math.random() * 2.2 + 0.8;
                const duration = Math.random() * 2 + 2.5;
                const delay = Math.random() * 2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const opacity = Math.random() * 0.5 + 0.5;
                return {
                    key: i,
                    top,
                    left,
                    size,
                    duration,
                    delay,
                    color,
                    opacity,
                };
            }),
        [count]
    );
    return (
        <div className="starry-bg fixed inset-0 pointer-events-none z-0">
            {stars.map((star) => (
                <div
                    key={star.key}
                    className="star absolute rounded-full"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: star.size,
                        height: star.size,
                        background: star.color,
                        opacity: star.opacity,
                        animation: `twinkle ${star.duration}s ease-in-out infinite ${star.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

const investmentQuotes = [
    "The best investment you can make is in yourself. – Warren Buffett",
    "Investing should be more like watching paint dry or watching grass grow. – Paul Samuelson",
    "The stock market is a device for transferring money from the impatient to the patient. – Warren Buffett",
    "Risk comes from not knowing what you're doing. – Warren Buffett",
    "Time is your friend; impulse is your enemy. – John Bogle",
];

// Mock data for demonstration
const mockPortfolioData = {
    totalValue: 125000000,
    totalGain: 8500000,
    gainPercentage: 7.28,
    monthlyChange: 2.3,
    topHoldings: [
        { name: "Bank Central Asia Tbk", symbol: "BBCA", value: 25000000, change: 3.2, color: "blue" },
        { name: "Telkom Indonesia Tbk", symbol: "TLKM", value: 18000000, change: -1.5, color: "red" },
        { name: "Astra International Tbk", symbol: "ASII", value: 22000000, change: 20.8, color: "green" },
        { name: "Unilever Indonesia Tbk", symbol: "UNVR", value: 15000000, change: 1.7, color: "purple" },
    ],
    recentTransactions: [
        { type: "buy", symbol: "BBCA", shares: 100, price: 9000, date: "2024-01-25" },
        { type: "sell", symbol: "TLKM", shares: 50, price: 4200, date: "2024-01-24" },
        { type: "buy", symbol: "ASII", shares: 150, price: 6000, date: "2024-01-15" },
    ]
};

const IDX_STOCKS = [
    { symbol: "BBCA.JK", name: "Bank Central Asia Tbk" },
    { symbol: "ADRO.JK", name: "PT Alamtri Resources Indonesia Tbk" },
    { symbol: "CDIA.JK", name: "PT Chandra Daya Investasi Tbk" },
    { symbol: "MERI.JK", name: "PT Merry Riana Edukasi Tbk" },
    { symbol: "PSAT.JK", name: "PT Pancaran Samudera Transport Tbk" },
];

const dashboardTabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "holdings", label: "Holdings", icon: "💼" },
    { id: "activity", label: "Activity", icon: "📝" },
    { id: "insights", label: "Insights", icon: "💡" },
    { id: "idx", label: "IDX", icon: "🇮🇩" },
];

export default function UserDashboard({ auth, user }) {
    const [quote, setQuote] = useState("");
    const [portfolioData] = useState(mockPortfolioData);
    const [activeTab, setActiveTab] = useState(() => {
        // Get saved tab from localStorage, default to "overview"
        return localStorage.getItem('dashboardActiveTab') || "overview";
    });
    const [idxSearch, setIdxSearch] = useState("");
    const [idxData, setIdxData] = useState([]);
    const [idxLoading, setIdxLoading] = useState(false);

    useEffect(() => {
        setQuote(investmentQuotes[Math.floor(Math.random() * investmentQuotes.length)]);
    }, []);

    // Save active tab to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('dashboardActiveTab', activeTab);
    }, [activeTab]);

    // Fetch IDX stocks data
    useEffect(() => {
        if (activeTab !== "idx") return;
        let interval;
        const fetchData = async () => {
            setIdxLoading(true);
            try {
                const filtered = IDX_STOCKS.filter(
                    s =>
                        s.symbol.toLowerCase().includes(idxSearch.toLowerCase()) ||
                        s.name.toLowerCase().includes(idxSearch.toLowerCase())
                );
                const promises = filtered.map(async (stock) => {
                    console.log(`Fetching: ${stock.symbol}`);
                    const res = await fetch(
                        `/api/stock-data/${stock.symbol}`
                    );
                    const data = await res.json();
                    console.log(`Response for ${stock.symbol}:`, data);
                    
                    if (data.chart && data.chart.error) {
                        console.error(`Error for ${stock.symbol}:`, data.chart.error);
                        return { ...stock, price: "Error", change: "Error", changePercent: "Error" };
                    }
                    
                    if (
                        data.chart &&
                        data.chart.result &&
                        data.chart.result[0]
                    ) {
                        const result = data.chart.result[0];
                        console.log(`Success for ${stock.symbol}:`, result.meta);
                        return {
                            symbol: stock.symbol,
                            name: stock.name,
                            price: result.meta.regularMarketPrice,
                            prevClose: result.meta.previousClose,
                            change: result.meta.regularMarketPrice - result.meta.previousClose,
                            changePercent:
                                ((result.meta.regularMarketPrice - result.meta.previousClose) /
                                    result.meta.previousClose) *
                                100,
                        };
                    }
                    return { ...stock, price: "No Data", change: "No Data", changePercent: "No Data" };
                });
                const results = await Promise.all(promises);
                console.log("Final results:", results);
                setIdxData(results);
            } catch (e) {
                console.error("Fetch error:", e);
                setIdxData([]);
            }
            setIdxLoading(false);
        };
        fetchData();
        interval = setInterval(fetchData, 20000);
        return () => clearInterval(interval);
    }, [activeTab, idxSearch]);

    if (!auth || !auth.user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-800 to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Loading your portfolio...
                    </h1>
                    <p className="text-gray-300">
                        Please wait while we load your investment dashboard...
                    </p>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return 'Rp ' + amount.toLocaleString('id-ID', { minimumFractionDigits: 0 });
    };

    const formatPercentage = (value) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    };

        return (
        <div className="min-h-screen bg-black relative">
            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
            <StarBackground count={500} />
            <div className="relative z-10">
                <AppLayout auth={auth} hideSidebar>
                    {/* Hero Section with Gradient Background */}
                    <div className="relative rounded-2xl p-8 mb-8 overflow-hidden bg-gradient-to-r from-gray-900/80 via-slate-800/80 to-gray-800/80 shadow-xl backdrop-blur-sm border border-gray-700/50">
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold text-white mb-2">
                                        <ScrambleText text={`Welcome back, ${auth.user.name}! 👋`} />
                                    </h1>
                                    <p className="text-gray-300 italic text-lg mb-6 max-w-2xl">
                                        "{quote}"
                                    </p>
                            {/* Portfolio Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-4 border border-gray-700">
                                    <div className="text-gray-300 text-sm font-medium">Total Portfolio</div>
                                    <div className="text-2xl font-bold text-white">{formatCurrency(portfolioData.totalValue)}</div>
                                    <div className="text-green-300">{formatPercentage(portfolioData.gainPercentage)}</div>
                                </div>
                                <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-4 border border-gray-700">
                                    <div className="text-gray-300 text-sm font-medium">Total Gain</div>
                                    <div className="text-2xl font-bold text-green-300">{formatCurrency(portfolioData.totalGain)}</div>
                                    <div className="text-gray-300 text-sm">This year</div>
                                </div>
                                <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-4 border border-gray-700">
                                    <div className="text-gray-300 text-sm font-medium">Monthly Change</div>
                                    <div className="text-2xl font-bold text-gray-200">{formatPercentage(portfolioData.monthlyChange)}</div>
                                    <div className="text-gray-300 text-sm">This month</div>
                                </div>
                                <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-4 border border-gray-700">
                                    <div className="text-gray-300 text-sm font-medium">Active Holdings</div>
                                    <div className="text-2xl font-bold text-white">{portfolioData.topHoldings.length}</div>
                                    <div className="text-gray-300 text-sm">This quarter</div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="text-8xl opacity-10">💸</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <TabNavigation 
                tabs={dashboardTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-6 border border-gray-700 hover:shadow-lg hover:border-gray-500 transition-all duration-200 cursor-pointer group">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                                    <span className="text-2xl text-white">➕</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Add Investment</h3>
                                    <p className="text-gray-300 text-sm">Record a new investment</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-6 border border-gray-700 hover:shadow-lg hover:border-gray-500 transition-all duration-200 cursor-pointer group">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                                    <span className="text-2xl text-white">📊</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">View Portfolio</h3>
                                    <p className="text-gray-300 text-sm">Check your investment performance</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-6 border border-gray-700 hover:shadow-lg hover:border-gray-500 transition-all duration-200 cursor-pointer group">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                                    <span className="text-2xl text-white">📈</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Deep Dive</h3>
                                    <p className="text-gray-300 text-sm">Deep dive into your data</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Market Overview */}
                    <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-xl shadow-sm border border-gray-700/50 p-6 backdrop-blur-sm">
                                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                        <span className="mr-2">🌍</span>
                                        <ScrambleText text="Market Overview" />
                                    </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-300">IHSG</div>
                                        <div className="text-lg font-semibold text-white">7,200.00</div>
                                    </div>
                                    <div className="text-green-300 text-sm font-medium">+0.85%</div>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-300">LQ45</div>
                                        <div className="text-lg font-semibold text-white">1,000.00</div>
                                    </div>
                                    <div className="text-green-300 text-sm font-medium">+1.12%</div>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-300">KOMPAS100</div>
                                        <div className="text-lg font-semibold text-white">1,200.00</div>
                                    </div>
                                    <div className="text-red-300 text-sm font-medium">-0.23%</div>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-300">VIX</div>
                                        <div className="text-lg font-semibold text-white">12.45</div>
                                    </div>
                                    <div className="text-green-300 text-sm font-medium">-2.1%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "holdings" && (
                <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-xl shadow-sm border border-gray-700/50 p-6 backdrop-blur-sm">
                                                        <h3 className="text-xl font-semibold text-white flex items-center">
                                        <span className="mr-2">💼</span>
                                        <ScrambleText text="Top Holdings" />
                                    </h3>
                    <div className="space-y-4">
                        {portfolioData.topHoldings.map((holding, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-3 h-3 rounded-full bg-${holding.color}-500`}></div>
                                    <div>
                                        <div className="font-semibold text-white">{holding.name}</div>
                                        <div className="text-sm text-gray-300">{holding.symbol}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-white">{formatCurrency(holding.value)}</div>
                                    <div className={`text-sm font-medium ${holding.change >= 0 ? 'text-green-300' : 'text-red-300'}`}>{formatPercentage(holding.change)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "activity" && (
                <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-xl shadow-sm border border-gray-700/50 p-6 backdrop-blur-sm">
                                                        <h3 className="text-xl font-semibold text-white flex items-center">
                                        <span className="mr-2">📝</span>
                                        <ScrambleText text="Recent Activity" />
                                    </h3>
                    <div className="space-y-4">
                        {portfolioData.recentTransactions.map((transaction, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        transaction.type === "buy" ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                    }`}>
                                        {transaction.type === "buy" ? '📈' : '📉'}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">
                                            {transaction.type === "buy" ? 'Beli' : 'Jual'} {transaction.shares} {transaction.symbol}
                                        </div>
                                        <div className="text-sm text-gray-300">{transaction.date}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-white">{formatCurrency(transaction.price)}</div>
                                    <div className="text-sm text-gray-300">per lembar</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "insights" && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-gray-900/80 to-slate-900/80 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
                                                            <h3 className="text-xl font-semibold text-white flex items-center">
                                        <span className="mr-2">💡</span>
                                        <ScrambleText text="Investment Insights" />
                                    </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-800 rounded-lg p-4 shadow-sm">
                                <h4 className="font-semibold text-white">Portfolio Diversification</h4>
                                <p className="text-gray-300 text-sm mb-3">Portofolio kamu sudah cukup terdiversifikasi di berbagai sektor.</p>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-green-400 h-2 rounded-full" style={{width: '75%'}}></div>
                                </div>
                                <div className="text-xs text-gray-300 mt-1">75% diversified</div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 shadow-sm">
                                <h4 className="font-semibold text-white mb-2">Risk Assessment</h4>
                                <p className="text-gray-300 text-sm mb-3">Level risiko kamu saat ini moderat, cocok untuk pertumbuhan jangka panjang.</p>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-yellow-400 h-2 rounded-full" style={{width: '60%'}}></div>
                                </div>
                                <div className="text-xs text-gray-300 mt-1">Risiko moderat</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-xl shadow-sm border border-gray-700/50 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white">Rekomendasi</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3 bg-green-900 rounded-lg border border-green-800 p-3">
                                <span className="text-green-300 text-lg">✅</span>
                                <div>
                                    <div className="font-medium text-white">Pertimbangkan rebalancing</div>
                                    <div className="text-sm text-gray-300">Alokasi sektor teknologi kamu sedikit overweight. Diversifikasi ke sektor lain bisa dipertimbangkan.</div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 bg-gray-800 rounded-lg border border-gray-700">
                                <span className="text-gray-300 text-lg">💡</span>
                                <div>
                                    <div className="font-medium text-white">Peluang tax-loss harvesting</div>
                                    <div className="text-sm text-gray-300">Jual posisi yang kurang perform untuk mengimbangi keuntungan.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* IDX Tab */}
            {activeTab === "idx" && (
                <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-xl shadow-sm border border-gray-700/50 p-6 backdrop-blur-sm">
                                                        <h3 className="text-xl font-semibold text-white flex items-center mb-4">
                                        <span className="mr-2">🇮🇩</span>
                                        <ScrambleText text="IDX Saham Indonesia" />
                                    </h3>
                    <input
                        type="text"
                        placeholder="Cari kode/nama saham..."
                        value={idxSearch}
                        onChange={e => setIdxSearch(e.target.value)}
                        className="mb-4 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
                    />
                    {idxLoading && (
                        <div className="text-gray-300 mb-2">Loading data...</div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-700">
                                    <th className="py-2 px-2">Kode</th>
                                    <th className="py-2 px-2">Nama</th>
                                    <th className="py-2 px-2">Harga</th>
                                    <th className="py-2 px-2">Perubahan</th>
                                    <th className="py-2 px-2">% Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {idxData.map((stock) => (
                                    <tr key={stock.symbol} className="border-b border-gray-800 hover:bg-gray-800">
                                        <td className="py-2 px-2 font-bold text-white">{stock.symbol.replace('.JK', '')}</td>
                                        <td className="py-2 px-2 text-gray-200">{stock.name}</td>
                                        <td className="py-2 px-2 text-white">{typeof stock.price === 'number' ? stock.price.toLocaleString('id-ID') : '-'}</td>
                                        <td className={`py-2 px-2 ${stock.change > 0 ? 'text-green-400' : stock.change < 0 ? 'text-red-400' : 'text-gray-300'}`}>{typeof stock.change === 'number' ? stock.change.toFixed(2) : '-'}</td>
                                        <td className={`py-2 px-2 ${stock.changePercent > 0 ? 'text-green-400' : stock.changePercent < 0 ? 'text-red-400' : 'text-gray-300'}`}>{typeof stock.changePercent === 'number' ? stock.changePercent.toFixed(2) + '%' : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {idxData.length === 0 && !idxLoading && (
                            <div className="text-gray-400 text-center py-8">Tidak ada data saham ditemukan.</div>
                        )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Data From Yahoo Finance (Delay ±15-20 minutes, Auto-refresh 20 seconds)</div>
                </div>
            )}
                </AppLayout>
            </div>
        </div>
    );
}