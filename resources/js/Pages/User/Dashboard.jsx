import React, { useEffect, useState, useMemo } from "react";
import AppLayout from "../../Layouts/AppLayout";
import TabNavigation from "../../Components/TabNavigation";
import Create from "./Create";
import HoldingsTab from "./HoldingsTab";
import OverviewTab from "./OverviewTab";
import ActivityTab from "./ActivityTab";
import InsightsTab from "./InsightsTab";
import IDXTab from "./IDXTab";

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
    return (
        <span
            style={{
                color: "#FFE81F",
                fontFamily: "Montserrat, Arial, sans-serif",
            }}
        >
            {display}
        </span>
    );
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
        {
            name: "Bank Central Asia Tbk",
            symbol: "BBCA",
            value: 25000000,
            change: 3.2,
            color: "blue",
        },
        {
            name: "Telkom Indonesia Tbk",
            symbol: "TLKM",
            value: 18000000,
            change: -1.5,
            color: "red",
        },
        {
            name: "Astra International Tbk",
            symbol: "ASII",
            value: 22000000,
            change: 20.8,
            color: "green",
        },
        {
            name: "Unilever Indonesia Tbk",
            symbol: "UNVR",
            value: 15000000,
            change: 1.7,
            color: "purple",
        },
    ],
    recentTransactions: [
        {
            type: "buy",
            symbol: "BBCA",
            shares: 100,
            price: 9000,
            date: "2024-01-25",
        },
        {
            type: "sell",
            symbol: "TLKM",
            shares: 50,
            price: 4200,
            date: "2024-01-24",
        },
        {
            type: "buy",
            symbol: "ASII",
            shares: 150,
            price: 6000,
            date: "2024-01-15",
        },
    ],
};

const IDX_STOCKS = [
    { symbol: "BBCA.JK", name: "Bank Central Asia Tbk" },
    { symbol: "ADRO.JK", name: "Alamtri Resources Indonesia Tbk" },
    { symbol: "CDIA.JK", name: "Chandra Daya Investasi Tbk" },
    { symbol: "MERI.JK", name: "Merry Riana Edukasi Tbk" },
    { symbol: "PSAT.JK", name: "Pancaran Samudera Transport Tbk" },
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
        return localStorage.getItem("dashboardActiveTab") || "overview";
    });
    const [idxSearch, setIdxSearch] = useState("");
    const [idxData, setIdxData] = useState([]);
    const [idxLoading, setIdxLoading] = useState(false);
    const [showAddInvestment, setShowAddInvestment] = useState(false);
    const [investmentForm, setInvestmentForm] = useState({
        name: "",
        type: "",
        lot: "",
        amount: "",
        buy_price: "",
        buy_date: "",
        notes: "",
    });
    const [snapshotForm, setSnapshotForm] = useState({
        date: new Date().toISOString().slice(0, 10),
        total_value: "",
        total_gain: "",
        notes: "",
    });
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState([]);
    const [investments, setInvestments] = useState([]);

    // Fetch summary, history, investments
    useEffect(() => {
        fetch("/investment-snapshots/latest")
            .then((res) => res.json())
            .then(setSummary);
        fetch("/investment-snapshots")
            .then((res) => res.json())
            .then(setHistory);
        fetch("/investments")
            .then((res) => res.json())
            .then(setInvestments);
    }, []);

    // Handler Add Investment
    const handleAddInvestment = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch("/investments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {})
                },
                body: JSON.stringify(investmentForm),
            });
            if (!res.ok) {
                let errMsg = "Gagal tambah investasi.";
                try {
                    const err = await res.json();
                    errMsg += " " + (err.message || JSON.stringify(err));
                } catch {}
                alert(errMsg);
                return;
            }
            setShowAddInvestment(false);
            setInvestmentForm({
                name: "",
                type: "",
                lot: "",
                amount: "",
                buy_price: "",
                buy_date: "",
                notes: "",
            });
            // Refresh data
            fetch("/investments")
                .then((res) => res.json())
                .then(setInvestments);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    // Handler Add Snapshot
    const handleAddSnapshot = async (e) => {
        e.preventDefault();
        await fetch("/investment-snapshots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(snapshotForm),
        });
        setSnapshotForm({
            date: new Date().toISOString().slice(0, 10),
            total_value: "",
            total_gain: "",
            notes: "",
        });
        // Refresh data
        fetch("/investment-snapshots/latest")
            .then((res) => res.json())
            .then(setSummary);
        fetch("/investment-snapshots")
            .then((res) => res.json())
            .then(setHistory);
    };

    useEffect(() => {
        setQuote(
            investmentQuotes[
                Math.floor(Math.random() * investmentQuotes.length)
            ]
        );
    }, []);

    // Save active tab to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("dashboardActiveTab", activeTab);
    }, [activeTab]);

    // Fetch IDX stocks data
    useEffect(() => {
        if (activeTab !== "idx") return;
        let interval;
        const fetchData = async () => {
            setIdxLoading(true);
            try {
                const filtered = IDX_STOCKS.filter(
                    (s) =>
                        s.symbol
                            .toLowerCase()
                            .includes(idxSearch.toLowerCase()) ||
                        s.name.toLowerCase().includes(idxSearch.toLowerCase())
                );
                const promises = filtered.map(async (stock) => {
                    console.log(`Fetching: ${stock.symbol}`);
                    const res = await fetch(`/api/stock-data/${stock.symbol}`);
                    const data = await res.json();
                    console.log(`Response for ${stock.symbol}:`, data);

                    if (data.chart && data.chart.error) {
                        console.error(
                            `Error for ${stock.symbol}:`,
                            data.chart.error
                        );
                        return {
                            ...stock,
                            price: "Error",
                            change: "Error",
                            changePercent: "Error",
                        };
                    }

                    if (
                        data.chart &&
                        data.chart.result &&
                        data.chart.result[0]
                    ) {
                        const result = data.chart.result[0];
                        console.log(
                            `Success for ${stock.symbol}:`,
                            result.meta
                        );
                        return {
                            symbol: stock.symbol,
                            name: stock.name,
                            price: result.meta.regularMarketPrice,
                            prevClose: result.meta.previousClose,
                            change:
                                result.meta.regularMarketPrice -
                                result.meta.previousClose,
                            changePercent:
                                ((result.meta.regularMarketPrice -
                                    result.meta.previousClose) /
                                    result.meta.previousClose) *
                                100,
                        };
                    }
                    return {
                        ...stock,
                        price: "No Data",
                        change: "No Data",
                        changePercent: "No Data",
                    };
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
        return null; // Hilangkan tampilan loading biru besar
    }

    const formatCurrency = (amount) => {
        return (
            "Rp " + amount.toLocaleString("id-ID", { minimumFractionDigits: 0 })
        );
    };

    const formatPercentage = (value) => {
        return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
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
                                        <ScrambleText
                                            text={`Welcome back, ${auth.user.name}! 👋`}
                                        />
                                    </h1>
                                    <p className="text-gray-300 italic text-lg mb-6 max-w-2xl">
                                        "{quote}"
                                    </p>
                                    {/* Portfolio Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-4 border border-gray-700">
                                            <div className="text-gray-300 text-sm font-medium">
                                                Total Portfolio
                                            </div>
                                            <div className="text-2xl font-bold text-white">
                                                {formatCurrency(
                                                    portfolioData.totalValue
                                                )}
                                            </div>
                                            <div className="text-green-300">
                                                {formatPercentage(
                                                    portfolioData.gainPercentage
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-4 border border-gray-700">
                                            <div className="text-gray-300 text-sm font-medium">
                                                Total Gain
                                            </div>
                                            <div className="text-2xl font-bold text-green-300">
                                                {formatCurrency(
                                                    portfolioData.totalGain
                                                )}
                                            </div>
                                            <div className="text-gray-300 text-sm">
                                                This year
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-4 border border-gray-700">
                                            <div className="text-gray-300 text-sm font-medium">
                                                Monthly Change
                                            </div>
                                            <div className="text-2xl font-bold text-gray-200">
                                                {formatPercentage(
                                                    portfolioData.monthlyChange
                                                )}
                                            </div>
                                            <div className="text-gray-300 text-sm">
                                                This month
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-4 border border-gray-700">
                                            <div className="text-gray-300 text-sm font-medium">
                                                Active Holdings
                                            </div>
                                            <div className="text-2xl font-bold text-white">
                                                {
                                                    portfolioData.topHoldings
                                                        .length
                                                }
                                            </div>
                                            <div className="text-gray-300 text-sm">
                                                This quarter
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <div className="text-8xl opacity-10">
                                        💸
                                    </div>
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
                        <OverviewTab
                            summary={summary}
                            history={history}
                            investments={investments}
                            showAddInvestment={showAddInvestment}
                            setShowAddInvestment={setShowAddInvestment}
                            investmentForm={investmentForm}
                            setInvestmentForm={setInvestmentForm}
                            handleAddInvestment={handleAddInvestment}
                            snapshotForm={snapshotForm}
                            setSnapshotForm={setSnapshotForm}
                            handleAddSnapshot={handleAddSnapshot}
                        />
                    )}
                    {activeTab === "holdings" && (
                        <HoldingsTab investments={investments} />
                    )}
                    {activeTab === "activity" && (
                        <ActivityTab history={history} />
                    )}
                    {activeTab === "insights" && (
                        <InsightsTab />
                    )}
                    {activeTab === "idx" && (
                        <IDXTab
                            idxSearch={idxSearch}
                            setIdxSearch={setIdxSearch}
                            idxData={idxData}
                            idxLoading={idxLoading}
                        />
                    )}
                </AppLayout>
            </div>
        </div>
    );
}
