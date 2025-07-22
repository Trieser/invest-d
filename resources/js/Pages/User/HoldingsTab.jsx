import React from "react";

export default function HoldingsTab({ investments }) {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-xl shadow-sm border border-gray-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-white flex items-center mb-4">
        <span className="mr-2">💼</span>
        Your Holdings
      </h3>
      {investments.length === 0 ? (
        <div className="text-gray-400">No holdings yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">Type</th>
                <th className="py-2 px-2">Lot</th>
                <th className="py-2 px-2">Amount</th>
                <th className="py-2 px-2">Buy Price</th>
                <th className="py-2 px-2">Buy Date</th>
                <th className="py-2 px-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {investments.map(inv => (
                <tr key={inv.id} className="border-b border-gray-700 hover:bg-gray-700/40">
                  <td className="py-2 px-2 text-white font-semibold">{inv.name}</td>
                  <td className="py-2 px-2 text-gray-200">{inv.type}</td>
                  <td className="py-2 px-2 text-gray-200">{inv.lot}</td>
                  <td className="py-2 px-2 text-gray-200">{inv.amount}</td>
                  <td className="py-2 px-2 text-gray-200">Rp {Number(inv.buy_price).toLocaleString("id-ID")}</td>
                  <td className="py-2 px-2 text-gray-200">{inv.buy_date}</td>
                  <td className="py-2 px-2 text-gray-400">{inv.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 