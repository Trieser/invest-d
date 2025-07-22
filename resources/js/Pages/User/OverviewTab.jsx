import React, { useEffect, useRef } from "react";
import Create from "./Create";
import gsap from "gsap";

export default function OverviewTab({
  summary,
  history,
  investments,
  showAddInvestment,
  setShowAddInvestment,
  investmentForm,
  setInvestmentForm,
  handleAddInvestment,
  snapshotForm,
  setSnapshotForm,
  handleAddSnapshot
}) {
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
  }, [investments]);

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl p-6 border border-gray-700 hover:shadow-lg hover:border-gray-500 transition-all duration-200 cursor-pointer group"
          onClick={() => setShowAddInvestment(true)}
        >
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
        {/* ...tambahkan quick actions lain jika ada... */}
      </div>

      {/* Modal Add Investment */}
      <Create show={showAddInvestment} onClose={() => setShowAddInvestment(false)}>
        <h2 className="text-xl font-bold text-white mb-4">Add Investment</h2>
        <form onSubmit={handleAddInvestment} className="space-y-3">
          <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Name" required
            value={investmentForm.name}
            onChange={e => setInvestmentForm(f => ({ ...f, name: e.target.value }))}
          />
          <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Type (e.g. saham, reksadana)" required
            value={investmentForm.type}
            onChange={e => setInvestmentForm(f => ({ ...f, type: e.target.value }))}
          />
          <div className="flex gap-2">
            <input
              className="w-1/2 p-2 rounded bg-gray-800 text-white"
              placeholder="Lot"
              type="number"
              min="0"
              value={investmentForm.lot}
              onChange={e => {
                const lot = e.target.value;
                setInvestmentForm(f => ({
                  ...f,
                  lot,
                  amount: lot ? Number(lot) * 100 : ""
                }));
              }}
            />
            <input
              className="w-1/2 p-2 rounded bg-gray-800 text-white"
              placeholder="Amount (lembar)"
              type="number"
              min="0"
              value={investmentForm.amount}
              onChange={e => {
                const amount = e.target.value;
                setInvestmentForm(f => ({
                  ...f,
                  amount,
                  lot: amount ? (Number(amount) / 100).toString() : ""
                }));
              }}
            />
          </div>
          <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Buy Price" type="number" required
            value={investmentForm.buy_price}
            onChange={e => setInvestmentForm(f => ({ ...f, buy_price: e.target.value }))}
          />
          <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Buy Date" type="date" required
            value={investmentForm.buy_date}
            onChange={e => setInvestmentForm(f => ({ ...f, buy_date: e.target.value }))}
          />
          <textarea className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Notes (optional)"
            value={investmentForm.notes}
            onChange={e => setInvestmentForm(f => ({ ...f, notes: e.target.value }))}
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2">Save</button>
        </form>
      </Create>

      {/* Form Update Portfolio Value */}
      <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-xl shadow-sm border border-gray-700/50 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-2">Update Portfolio Value</h3>
        <form onSubmit={handleAddSnapshot} className="flex flex-col md:flex-row md:items-end gap-3">
          <input className="p-2 rounded bg-gray-800 text-white" type="date" required
            value={snapshotForm.date}
            onChange={e => setSnapshotForm(f => ({ ...f, date: e.target.value }))}
          />
          <input className="p-2 rounded bg-gray-800 text-white" placeholder="Total Value (Rp)" type="number" required
            value={snapshotForm.total_value}
            onChange={e => setSnapshotForm(f => ({ ...f, total_value: e.target.value }))}
          />
          <input className="p-2 rounded bg-gray-800 text-white" placeholder="Total Gain (Rp)" type="number" required
            value={snapshotForm.total_gain}
            onChange={e => setSnapshotForm(f => ({ ...f, total_gain: e.target.value }))}
          />
          <input className="p-2 rounded bg-gray-800 text-white" placeholder="Notes (optional)"
            value={snapshotForm.notes}
            onChange={e => setSnapshotForm(f => ({ ...f, notes: e.target.value }))}
          />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Save</button>
        </form>
      </div>

      {/* Summary & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h4 className="text-white font-bold mb-2">Summary (Latest)</h4>
          {summary ? (
            <div>
              <div className="text-gray-300">Date: {summary.date}</div>
              <div className="text-white text-2xl font-bold">Rp {Number(summary.total_value).toLocaleString("id-ID")}</div>
              <div className="text-green-400">Gain: Rp {Number(summary.total_gain).toLocaleString("id-ID")}</div>
              <div className="text-gray-400 text-sm">{summary.notes}</div>
            </div>
          ) : (
            <div className="text-gray-400">No data yet.</div>
          )}
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <h4 className="text-white font-bold mb-2">History (Last 7)</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            {history.slice(0, 7).map(h => (
              <li key={h.id}>
                <span className="font-bold">{h.date}:</span> Rp {Number(h.total_value).toLocaleString("id-ID")} (Gain: Rp {Number(h.total_gain).toLocaleString("id-ID")})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* List Investment */}
      <div className="bg-gray-800 rounded-xl p-4 mt-6">
        <h4 className="text-white font-bold mb-2">List Investment</h4>
        {investments.length === 0 ? (
          <div className="text-gray-400">No data yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-800/80 to-slate-900/80">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Lot</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Buy Price</th>
                  <th className="py-3 px-3">Buy Date</th>
                  <th className="py-3 px-3">Notes</th>
                </tr>
              </thead>
              <tbody ref={tableBodyRef}>
                {investments.map(inv => (
                  <tr key={inv.id} className="border-b border-gray-700 hover:bg-blue-900/30 transition-all duration-200 rounded-lg" style={{ cursor: "pointer" }}>
                    <td className="py-2 px-3 text-white font-semibold">{inv.name}</td>
                    <td className="py-2 px-3 text-gray-200">{inv.type}</td>
                    <td className="py-2 px-3 text-gray-200">{inv.lot}</td>
                    <td className="py-2 px-3 text-gray-200">{inv.amount}</td>
                    <td className="py-2 px-3 text-blue-300 font-bold">Rp {Number(inv.buy_price).toLocaleString("id-ID")}</td>
                    <td className="py-2 px-3 text-gray-200">{inv.buy_date}</td>
                    <td className="py-2 px-3 text-gray-400">{inv.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 