import React from "react";
import ScrambleText from "./Dashboard";

export default function IDXTab({ idxSearch, setIdxSearch, idxData, idxLoading }) {
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
  );
} 