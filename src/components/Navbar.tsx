import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface City { name: string; state: string; }

// ─── Data ─────────────────────────────────────────────────────────────────────
const POPULAR_CITIES: City[] = [
    { name: "Mumbai", state: "Maharashtra" },
    { name: "Delhi", state: "Delhi" },
    { name: "Bangalore", state: "Karnataka" },
    { name: "Hyderabad", state: "Telangana" },
    { name: "Chennai", state: "Tamil Nadu" },
    { name: "Kolkata", state: "West Bengal" },
    { name: "Pune", state: "Maharashtra" },
    { name: "Ahmedabad", state: "Gujarat" },
];

const MENU_ITEMS = [
    { label: "Home", icon: "fa-home", id: "Home", path: "/" },
    { label: "Services", icon: "fa-book", id: "Services", path: "/services" },
    { label: "About Us", icon: "fa-user", id: "About", path: "/about" },
    { label: "Contact Us", icon: "fa-phone", id: "Contact", path: "/contact" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();
    const darkMode = isDark;

    const [open, setOpen] = useState(false);
    const [locOpen, setLocOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [selectedCity, setSelectedCity] = useState<City | null>(() => {
        const saved = sessionStorage.getItem("kg_selected_city");
        return saved ? JSON.parse(saved) : null;
    });
    const [citySearch, setCitySearch] = useState("");
    const [askLocation, setAskLocation] = useState(false);
    const [locLoading, setLocLoading] = useState(false);

    const menuRef = useRef<HTMLElement>(null);
    const locRef = useRef<HTMLLIElement>(null);

    // ── Track location path to set active nav ──────────────────────────────
    useEffect(() => {
        if (location.pathname.startsWith("/services")) {
            setActiveSection("Services");
        } else if (location.pathname.startsWith("/about")) {
            setActiveSection("About");
        } else if (location.pathname.startsWith("/contact")) {
            setActiveSection("Contact");
        } else if (location.pathname === "/") {
            setActiveSection("Home");
        }
    }, [location.pathname]);

    // ── Close menus on outside click ─────────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
            if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Geolocation ──────────────────────────────────────────────────────────
    const requestGeoLocation = () => {
        setLocLoading(true);
        navigator.geolocation.getCurrentPosition(
            () => {
                const detected = { name: "Current Location", state: "Detected" };
                setSelectedCity(detected);
                sessionStorage.setItem("kg_selected_city", JSON.stringify(detected));
                setAskLocation(false);
                setLocLoading(false);
            },
            () => {
                setLocLoading(false);
                setAskLocation(false);
            }
        );
    };

    const dismissLocation = () => {
        setAskLocation(false);
    };

    const pickCity = (city: City) => {
        setSelectedCity(city);
        sessionStorage.setItem("kg_selected_city", JSON.stringify(city));
        setLocOpen(false);
        setCitySearch("");
    };

    const handleNavigation = (item: { label: string; icon: string; id: string; path?: string }) => {
        setOpen(false);
        setActiveSection(item.id);
        if (item.label === "Services" || item.path === "/services") {
            navigate("/services");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (item.label === "About Us" || item.path === "/about") {
            navigate("/about");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (item.label === "Contact Us" || item.path === "/contact") {
            navigate("/contact");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const targetId = item.id;
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const el = document.getElementById(targetId) || document.getElementById(targetId.toLowerCase());
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            }, 100);
        } else {
            const el = document.getElementById(targetId) || document.getElementById(targetId.toLowerCase());
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    const isItemActive = (item: typeof MENU_ITEMS[0]) => {
        if (item.path === "/services") {
            return location.pathname.startsWith("/services");
        }
        if (item.path === "/about") {
            return location.pathname.startsWith("/about");
        }
        if (item.path === "/contact") {
            return location.pathname.startsWith("/contact");
        }
        if (location.pathname === "/") {
            return item.id === activeSection;
        }
        return false;
    };

    const filtered = POPULAR_CITIES.filter(c =>
        c.name.toLowerCase().includes(citySearch.toLowerCase())
    );

    // ── Theme tokens ─────────────────────────────────────────────────────────
    const nav = "bg-[#0F172A] border-slate-800 text-white";
    const drop = darkMode ? "bg-slate-800 border-slate-700 text-slate-100"
        : "bg-white border-slate-200 text-slate-800";
    const pill = "bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700";

    return (
        <>
            {/* ── Location Permission Modal ── */}
            {askLocation && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className={`rounded-2xl shadow-2xl p-6 w-full max-w-sm ${darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"}`}>
                        <div className="text-4xl mb-3 text-center">📍</div>
                        <h2 className="text-xl font-semibold text-center mb-1">Allow Location Access</h2>
                        <p className="text-sm text-center mb-5 opacity-60">
                            We use your location to show nearby services and events.
                        </p>
                        <button
                            onClick={requestGeoLocation}
                            disabled={locLoading}
                            className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition mb-2"
                        >
                            {locLoading ? "Detecting…" : "Allow Location"}
                        </button>
                        <button
                            onClick={dismissLocation}
                            className="w-full py-2.5 rounded-xl border border-slate-300 text-sm opacity-60 hover:opacity-100 transition"
                        >
                            Not Now
                        </button>
                    </div>
                </div>
            )}

            {/* ── Navbar ── */}
            <nav className={`w-full border-b transition-colors duration-500 ease-in-out ${nav} relative`} ref={menuRef}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <span
                        onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="text-3xl font-mono tracking-tight shrink-0 cursor-pointer font"
                    >
                        SayOne
                    </span>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center gap-8 text-base font-medium">
                        {MENU_ITEMS.map(item => {
                            const active = isItemActive(item);
                            return (
                                <li
                                    key={item.label}
                                    onClick={() => handleNavigation(item)}
                                    className={`flex items-center gap-2 cursor-pointer transition ${active
                                        ? "text-amber-400 font-bold"
                                        : "text-slate-200 hover:text-amber-400"
                                        }`}
                                >
                                    <i className={`fa ${item.icon}`}></i>
                                    <span>{item.label}</span>
                                </li>
                            );
                        })}

                        {/* ── Location Dropdown ── */}
                        <li className="relative" ref={locRef}>
                            <button
                                onClick={() => setLocOpen(p => !p)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${pill}`}
                            >
                                <i className="fa fa-map-marker text-red-400"></i>
                                <span className="max-w-[110px] truncate">
                                    {selectedCity ? selectedCity.name : "Select City"}
                                </span>
                                <i className={`fa fa-chevron-down text-xs transition-transform duration-200 ${locOpen ? "rotate-180" : ""}`}></i>
                            </button>

                            {locOpen && (
                                <div className={`absolute top-full mt-2 right-0 w-72 rounded-xl shadow-xl border z-50 overflow-hidden ${drop}`}>
                                    {/* Search */}
                                    <div className="p-3 border-b border-inherit">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search city…"
                                            value={citySearch}
                                            onChange={e => setCitySearch(e.target.value)}
                                            className={`w-full px-3 py-2 rounded-lg text-sm outline-none border ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`}
                                        />
                                    </div>

                                    {/* Detect My Location */}
                                    <button
                                        onClick={requestGeoLocation}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-amber-400 hover:bg-amber-400/10 transition border-b border-inherit"
                                    >
                                        <i className="fa fa-crosshairs"></i>
                                        Detect My Location
                                    </button>

                                    {/* City List */}
                                    <div className="max-h-52 overflow-y-auto">
                                        {filtered.length === 0 ? (
                                            <p className="text-center py-4 text-sm opacity-50">No cities found</p>
                                        ) : (
                                            filtered.map(city => (
                                                <button
                                                    key={city.name}
                                                    onClick={() => pickCity(city)}
                                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-amber-400/10 transition ${selectedCity?.name === city.name ? "text-amber-400 font-semibold" : ""}`}
                                                >
                                                    <span>{city.name}</span>
                                                    <span className="text-xs opacity-40">{city.state}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    </ul>

                    {/* Right Controls */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={(e) => toggleTheme(e)}
                            type="button"
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            aria-label="Toggle theme"
                            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-white-100 transition-colors duration-300 ease-in-out focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-slate-200 border-slate-300 hover:bg-slate-300"
                                }`}
                        >
                            <span
                                className={`pointer-events-none flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition duration-300 ease-in-out ${isDark ? "translate-x-7 bg-slate-900 text-amber-300" : "translate-x-0 bg-white text-amber-500"
                                    }`}
                            >
                                {isDark ? (
                                    <svg className="w-3.5 h-3.5 fill-current text-amber-300" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5 fill-current text-amber-500" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </span>
                        </button>

                        {/* Login Button */}
                        <button className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/20">
                            Join Early Access &nbsp;&nbsp;<i className="fa fa-arrow-right"></i>
                        </button>
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center gap-3">
                        <button
                            onClick={(e) => toggleTheme(e)}
                            type="button"
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            aria-label="Toggle theme"
                            className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-white-100 transition-colors duration-300 ease-in-out ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-200 border-slate-300"
                                }`}
                        >
                            <span
                                className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full shadow transition duration-300 ease-in-out ${isDark ? "translate-x-6 bg-slate-900 text-amber-300" : "translate-x-0 bg-white text-amber-500"
                                    }`}
                            >
                                {isDark ? (
                                    <svg className="w-3 h-3 fill-current text-amber-300" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                ) : (
                                    <svg className="w-3 h-3 fill-current text-amber-500" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </span>
                        </button>

                        <button
                            className="flex flex-col gap-1.5 relative z-50"
                            onClick={() => setOpen(!open)}
                        >
                            <span className={`w-6 h-[2px] bg-orange-400 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}></span>
                            <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`}></span>
                            <span className={`w-6 h-[2px] bg-green-400 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
                    <ul className={`px-6 py-4 space-y-3 text-base border-t ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                        {MENU_ITEMS.map((item, i) => {
                            const active = isItemActive(item);
                            return (
                                <li
                                    key={item.label}
                                    onClick={() => handleNavigation(item)}
                                    className={`flex items-center gap-3 cursor-pointer transition py-1 ${active ? "text-amber-400 font-bold" : "text-slate-200 hover:text-amber-400"}`}
                                    style={{
                                        transitionDelay: open ? `${i * 50}ms` : "0ms",
                                        opacity: open ? 1 : 0,
                                        transform: open ? "translateX(0)" : "translateX(-16px)",
                                    }}
                                >
                                    <i className={`fa ${item.icon} text-lg`}></i>
                                    <span>{item.label}</span>
                                </li>
                            );
                        })}

                        {/* Mobile Location */}
                        <li>
                            <button
                                onClick={() => setLocOpen(p => !p)}
                                className="flex items-center gap-2 text-yellow-400 py-1"
                            >
                                <i className="fa fa-map-marker"></i>
                                <span>{selectedCity ? selectedCity.name : "Select City"}</span>
                                <i className={`fa fa-chevron-down text-xs transition-transform ${locOpen ? "rotate-180" : ""}`}></i>
                            </button>

                            {locOpen && (
                                <div className={`mt-2 rounded-xl border overflow-hidden ${drop}`}>
                                    <button
                                        onClick={requestGeoLocation}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-yellow-400 border-b border-inherit"
                                    >
                                        <i className="fa fa-crosshairs"></i>
                                        Detect My Location
                                    </button>
                                    <div className="max-h-40 overflow-y-auto">
                                        {POPULAR_CITIES.map(city => (
                                            <button
                                                key={city.name}
                                                onClick={() => pickCity(city)}
                                                className={`w-full flex items-center justify-between px-4 py-2 text-sm ${selectedCity?.name === city.name ? "text-yellow-400 font-semibold" : ""}`}
                                            >
                                                <span>{city.name}</span>
                                                <span className="text-xs opacity-40">{city.state}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>

                        {/* Mobile Login */}
                        <li>
                            <button className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-red-300 transition mt-1">
                                Login
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;