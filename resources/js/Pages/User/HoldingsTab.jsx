import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HoldingsTab({ investments }) {
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
    <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-2xl shadow-xl border border-gray-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-white flex items-center mb-6 tracking-wide">
        <span className="mr-2">💼</span>
        Your Holdings
      </h3>
      {investments.length === 0 ? (
        <div className="text-gray-400">No holdings yet.</div>
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
                <tr
                  key={inv.id}
                  className="border-b border-gray-700 hover:bg-blue-900/30 transition-all duration-200 rounded-lg"
                  style={{ cursor: "pointer" }}
                >
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
  );
} 