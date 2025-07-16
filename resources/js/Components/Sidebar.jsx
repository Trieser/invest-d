import React, { useState, useRef } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Sidebar({
    auth,
    currentPage = "dashboard",
}) {
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 640);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menu = [
        {
            icon: "🏠",
            page: "dashboard",
            onClick: () => Inertia.visit("/user/dashboard"),
            label: "Dashboard",
        },
        {
            icon: "➕",
            page: "add-investment",
            onClick: () => Inertia.visit("/user/investments/create"),
            label: "Add Investment",
        },
        {
            icon: "📊",
            page: "portfolio",
            onClick: () => Inertia.visit("/user/portfolio"),
            label: "Portfolio",
        },
        {
            icon: "📈",
            page: "analytics",
            onClick: () => Inertia.visit("/user/analytics"),
            label: "Analytics",
        },
    ];

    return (
        <aside
            className={`
            fixed z-50 bg-gradient-to-b from-blue-100 via-indigo-50 to-blue-50 shadow-md border border-blue-100
            flex sm:flex-col flex-row items-center justify-between
            sm:left-6 sm:top-1/2 sm:-translate-y-1/2 sm:w-20 sm:rounded-xl sm:py-2 sm:h-auto sm:max-h-[30vh]
            left-0 right-0 bottom-0 w-full h-16 rounded-t-xl
          `}
        >
            {/* Main Navigation (horizontal on mobile, vertical on desktop) */}
            <div className="flex flex-1 sm:flex-col flex-row items-center justify-between w-full h-full gap-2 px-2 sm:px-0">
                {menu.map((item) => (
                    <SidebarIcon
                        key={item.page}
                        icon={item.icon}
                        label={item.label}
                        active={currentPage === item.page}
                        onClick={item.onClick}
                        mobile={isMobile}
                    />
                ))}
            </div>
        </aside>
    );
}

function SidebarIcon({ icon, label, active, onClick, mobile }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center focus:outline-none transition-all duration-200 hover:scale-110 hover:shadow-lg hover:bg-blue-50 rounded-xl py-1 px-2 ${
                active ? "font-bold text-blue-700" : "text-gray-700"
            } ${mobile ? "text-xs" : ""}`}
            style={{ wordBreak: "break-word" }}
        >
            <span className="text-2xl relative">{icon}</span>
            <span className="text-xs mt-0.5 text-center whitespace-normal break-words max-w-[64px]">
                {label}
            </span>
        </button>
    );
}
