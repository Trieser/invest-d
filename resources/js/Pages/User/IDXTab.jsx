import React, { useEffect, useRef } from "react";
import ScrambleText from "./Dashboard";
import gsap from "gsap";

export default function IDXTab({ idxSearch, setIdxSearch, idxData, idxLoading }) {
  const tableBodyRef = useRef(null);

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
  }, [idxData]);

  return (
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
        <table className="min-w-full text-sm text-left rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-800/80 to-slate-900/80">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-3 px-3">Code</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Prev Close</th>
              <th className="py-3 px-3">High</th>
              <th className="py-3 px-3">Low</th>
              <th className="py-3 px-3">Volume</th>
              <th className="py-3 px-3">% Change</th>
            </tr>
          </thead>
          <tbody ref={tableBodyRef}>
            {idxData.map((stock) => (
              <tr key={stock.symbol} className="border-b border-gray-800 hover:bg-blue-900/30 transition-all duration-200 rounded-lg" style={{ cursor: "pointer" }}>
                <td className="py-2 px-3 font-bold text-white">{stock.symbol.replace('.JK', '')}</td>
                <td className="py-2 px-3 text-gray-200">{stock.shortName || stock.name}</td>
                <td className="py-2 px-3 text-white">{typeof stock.price === 'number' ? stock.price.toLocaleString('id-ID') : '-'}</td>
                <td className="py-2 px-3 text-gray-200">{typeof stock.prevClose === 'number' ? stock.prevClose.toLocaleString('id-ID') : '-'}</td>
                <td className="py-2 px-3 text-gray-200">{typeof stock.high === 'number' ? stock.high.toLocaleString('id-ID') : '-'}</td>
                <td className="py-2 px-3 text-gray-200">{typeof stock.low === 'number' ? stock.low.toLocaleString('id-ID') : '-'}</td>
                <td className="py-2 px-3 text-gray-200">{typeof stock.volume === 'number' ? stock.volume.toLocaleString('id-ID') : '-'}</td>
                <td className={`py-2 px-3 ${stock.changePercent > 0 ? 'text-green-400' : stock.changePercent < 0 ? 'text-red-400' : 'text-gray-300'}`}>{typeof stock.changePercent === 'number' ? stock.changePercent.toFixed(2) + '%' : '-'}</td>
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
  );
} 