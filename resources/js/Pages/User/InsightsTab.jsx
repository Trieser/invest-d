import React from "react";
import ScrambleText from "./Dashboard";

export default function InsightsTab() {
  return (
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
  );
} 