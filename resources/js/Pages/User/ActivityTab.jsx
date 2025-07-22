import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ActivityTab({ history }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.querySelectorAll(".activity-card"),
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
  }, [history]);

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-xl shadow-sm border border-gray-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-white flex items-center mb-4">
        <span className="mr-2">📝</span>
        Recent Activity
      </h3>
      <div className="space-y-4" ref={listRef}>
        {history.length === 0 ? (
          <div className="text-gray-400">No activity yet.</div>
        ) : (
          history.slice(0, 10).map((item, idx) => (
            <div key={item.id} className="activity-card flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow hover:bg-blue-900/30 transition-all duration-200">
              <div>
                <div className="font-semibold text-white">
                  {item.date}
                </div>
                <div className="text-sm text-gray-300">
                  Value: Rp {Number(item.total_value).toLocaleString("id-ID")} | Gain: Rp {Number(item.total_gain).toLocaleString("id-ID")}
                </div>
                {item.notes && <div className="text-xs text-gray-400 mt-1 italic">{item.notes}</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 