import React, { useState, useRef } from "react";
import { Inertia } from "@inertiajs/inertia";

function GenrePopout({
    genres,
    currentGenreId,
    onGenreClick,
    onMouseEnter,
    onMouseLeave,
    mobile,
}) {
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`absolute z-50 bg-white rounded-xl shadow-2xl border border-green-100 p-2 ${
                mobile
                    ? "left-1/2 -translate-x-1/2 top-full mt-2 min-w-[180px] max-w-[240px]"
                    : "left-full top-0 ml-2 min-w-[180px] max-w-[240px]"
            } max-h-80 overflow-y-auto`}
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
        >
            {genres.map((item) => (
                <button
                    key={item.page}
                    onClick={() => onGenreClick(item)}
                    className={`flex items-center gap-2 w-full px-2 py-1 rounded-lg mb-1 last:mb-0 text-left transition-colors ${
                        item.active
                            ? "bg-blue-100 text-green-700 font-bold"
                            : "text-gray-700 hover:bg-green-50"
                    }`}
                >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm whitespace-normal break-words max-w-[160px]">
                        {item.label}
                    </span>
                    {item.badge !== undefined && (
                        <span className="ml-auto bg-blue-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                            {item.badge}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

export default function Sidebar({
    auth,
    currentPage = "photos",
    currentGenreId = null,
    activeGenres = [],
}) {
    const [showGenrePopout, setShowGenrePopout] = useState(false);
    const popoutTimeout = useRef();
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
            label: "",
        },
        {
            icon: "➕",
            page: "photos",
            onClick: () => Inertia.visit("/user/photos"),
            label: "Add Photo",
        },
        {
            icon: "🏷️",
            page: "genres",
            onClick: () => Inertia.visit("/user/genres"),
            label: "All Genres",
        },
    ];
    const yourPhotoBtn = { icon: "🗂️", label: "Your Photo" };
    const genreMenus = activeGenres.map((genre) => ({
        icon: "📷",
        page: `genre-${genre.id}`,
        onClick: () => Inertia.visit(`/user/photos/genre/${genre.id}`),
        badge: genre.photo_count,
        active: currentGenreId === genre.id,
        label: genre.name,
    }));

    // Mouse handlers to keep popout open when hovering btn or popout
    const handleYourPhotoEnter = () => {
        clearTimeout(popoutTimeout.current);
        setShowGenrePopout(true);
    };
    const handleYourPhotoLeave = () => {
        popoutTimeout.current = setTimeout(
            () => setShowGenrePopout(false),
            120
        );
    };
    const handlePopoutEnter = () => {
        clearTimeout(popoutTimeout.current);
        setShowGenrePopout(true);
    };
    const handlePopoutLeave = () => {
        popoutTimeout.current = setTimeout(
            () => setShowGenrePopout(false),
            120
        );
    };

    return (
        <aside
            className={`
            fixed z-50 bg-gradient-to-b from-green-100 via-blue-50 to-green-50 shadow-md border border-green-100
            flex sm:flex-col flex-row items-center justify-between
            sm:left-6 sm:top-1/2 sm:-translate-y-1/2 sm:w-20 sm:rounded-xl sm:py-2 sm:h-auto sm:max-h-[30vh]
            left-0 right-0 bottom-0 w-full h-16 rounded-t-xl
          `}
        >
            {/* Main Navigation (horizontal on mobile, vertical on desktop) */}
            <div className="flex flex-1 sm:flex-col flex-row items-center justify-between w-full h-full gap-2 px-2 sm:px-0">
                {/* Dashboard */}
                <SidebarIcon
                    icon={menu[0].icon}
                    label={menu[0].label}
                    active={currentPage === menu[0].page}
                    onClick={menu[0].onClick}
                    mobile={isMobile}
                />
                {/* Upload Photo */}
                <SidebarIcon
                    icon={menu[1].icon}
                    label={menu[1].label}
                    active={currentPage === menu[1].page}
                    onClick={menu[1].onClick}
                    mobile={isMobile}
                />
                {/* Genres */}
                <SidebarIcon
                    icon={menu[2].icon}
                    label={menu[2].label}
                    active={currentPage === menu[2].page}
                    onClick={menu[2].onClick}
                    mobile={isMobile}
                />
                {/* Your Photo (popout genre) */}
                <div className="relative flex flex-col items-center sm:my-0 my-1">
                    <button
                        className={`flex flex-col items-center focus:outline-none transition-all duration-200 hover:scale-110 hover:shadow-lg hover:bg-green-50 rounded-xl py-1 px-2 ${
                            currentPage.startsWith("genre-")
                                ? "font-bold text-green-700"
                                : "text-gray-700"
                        }`}
                        onMouseEnter={handleYourPhotoEnter}
                        onMouseLeave={handleYourPhotoLeave}
                        onClick={(e) => e.preventDefault()}
                        type="button"
                    >
                        <span className="text-xl">{yourPhotoBtn.icon}</span>
                        <span className="text-xs mt-0.5">
                            {yourPhotoBtn.label}
                        </span>
                    </button>
                    {showGenrePopout && genreMenus.length > 0 && (
                        <GenrePopout
                            genres={genreMenus}
                            currentGenreId={currentGenreId}
                            onGenreClick={(item) => {
                                setShowGenrePopout(false);
                                item.onClick();
                            }}
                            onMouseEnter={handlePopoutEnter}
                            onMouseLeave={handlePopoutLeave}
                            mobile={isMobile}
                        />
                    )}
                </div>
            </div>
        </aside>
    );
}

function SidebarIcon({ icon, label, active, onClick, mobile }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center focus:outline-none transition-all duration-200 hover:scale-110 hover:shadow-lg hover:bg-green-50 rounded-xl py-1 px-2 ${
                active ? "font-bold text-green-700" : "text-gray-700"
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
