import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function HoldingsTab({ investments }) {
  const tableBodyRef = useRef(null);
  const [currentPrices, setCurrentPrices] = useState({}); // {symbol: price}
  const [loading, setLoading] = useState(false);

  // Helper: ambil symbol dari nama saham (misal "Bank Central Asia Tbk" => "BBCA.JK")
  function getSymbolFromName(name) {
    // Sementara: ambil 4 huruf kapital pertama + .JK
    // (Sebaiknya simpan symbol di DB, ini hanya fallback)
    const match = name.match(/([A-Z]{4})/);
    return match ? match[1] + ".JK" : name;
  }

  useEffect(() => {
    if (tableBodyRef.current) {
      gsap.fromTo(
        tableBodyRef.current.querySelectorAll("tr"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }
  }, [investments, currentPrices]);

  useEffect(() => {
    if (!investments.length) return;
    setLoading(true);
    const fetchPrices = async () => {
      const results = {};
      await Promise.all(
        investments.map(async (inv) => {
          const symbol = inv.symbol || getSymbolFromName(inv.name);
          try {
            const res = await fetch(`/api/stock-data/${symbol}`);
            const data = await res.json();
            const price = data.chart?.result?.[0]?.meta?.regularMarketPrice;
            results[symbol] = price || 0;
          } catch {
            results[symbol] = 0;
          }
        })
      );
      setCurrentPrices(results);
      setLoading(false);
    };
    fetchPrices();
  }, [investments]);

  const formatCurrency = (amount) =>
    "Rp " + Number(amount).toLocaleString("id-ID", { minimumFractionDigits: 0 });
  const formatPercent = (val) =>
    (val >= 0 ? "+" : "") + val.toFixed(2) + "%";

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-2xl shadow-xl border border-gray-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-white flex items-center mb-6 tracking-wide">
        <span className="mr-2">💼</span>
        Your Holdings
      </h3>
      {loading && <div className="text-gray-300 mb-2">Loading current prices...</div>}
      {investments.length === 0 ? (
        <div className="text-gray-400">No holdings yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-800/80 to-slate-900/80">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Lot</th>
                <th className="py-3 px-3">Buy Price</th>
                <th className="py-3 px-3">Modal</th>
                <th className="py-3 px-3">Notes</th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef}>
              {investments.map((inv) => {
                const symbol = inv.symbol || getSymbolFromName(inv.name);
                const lot = Number(inv.lot) || 0;
                const buyPrice = Number(inv.buy_price) || 0;
                const modal = lot * 100 * buyPrice;
                return (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-700 hover:bg-blue-900/30 transition-all duration-200 rounded-lg"
                    style={{ cursor: "pointer" }}
                  >
                    <td className="py-2 px-3 text-white font-bold">{symbol.replace('.JK', '')}</td>
                    <td className="py-2 px-3 text-white font-semibold">{inv.name}</td>
                    <td className="py-2 px-3 text-gray-200">{lot}</td>
                    <td className="py-2 px-3 text-blue-300 font-bold">{formatCurrency(buyPrice)}</td>
                    <td className="py-2 px-3 text-gray-200">{formatCurrency(modal)}</td>
                    <td className="py-2 px-3 text-gray-400">{inv.notes || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-xs text-gray-500 mt-2">Harga sekarang diambil dari Yahoo Finance (delay ±15-20 menit).</div>
    </div>
  );
} 