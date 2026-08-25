import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/kgurukuls-logo.png";
import loginBgIcon from "../../assets/login-bg-icon.png";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
 import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { sendOTP, verifyOTP, type AuthResponse } from "../../api/api";

// =========================================================================
// TEST EMAIL BYPASS CONFIGURATION (Easy to remove later)
// Set TEST_BYPASS_ENABLED = false (or remove this block) to disable test mode.
// =========================================================================
const TEST_BYPASS_ENABLED = true;
const TEST_BYPASS_EMAILS = [
    "test@gmail.com",
    "test@kgurukul.com",
    "admin@test.com",
    "demo@gmail.com"
];
const TEST_BYPASS_OTP = "123456";
// =========================================================================

export default function NewLogin() {
    const navigate = useNavigate();
    const [step, setStep] = useState<"email" | "otp" | "success">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [timer, setTimer] = useState(600); // 10 minutes countdown
    const [isExpired, setIsExpired] = useState(false);

    // Email validation regex
    const validateEmail = (val: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(val);
    };

    // Helper to check test emails
    const isTestEmail = (mail: string): boolean => {
        if (!TEST_BYPASS_ENABLED) return false;
        const normalized = mail.trim().toLowerCase();
        return (
            TEST_BYPASS_EMAILS.includes(normalized) ||
            normalized.startsWith("test") ||
            normalized.endsWith("@test.com")
        );
    };

    // Timer countdown effect for OTP step
    useEffect(() => {
        let interval: number;

        if (step === "otp" && timer > 0 && !isExpired) {
            interval = window.setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setIsExpired(true);
                        setError("OTP has expired. Please request a new code.");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [step, timer, isExpired]);

    // Format timer display MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Send OTP handler
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        // Check for Test Email Bypass
        if (isTestEmail(email)) {
            setTimeout(() => {
                setIsLoading(false);
                setStep("otp");
                setTimer(600);
                setIsExpired(false);
                setOtp("");
                setSuccessMessage(`OTP sent successfully to ${email}`);
            }, 500);
            return;
        }

        // Real API Call
        try {
            await sendOTP(email);
            setIsLoading(false);
            setStep("otp");
            setTimer(600);
            setIsExpired(false);
            setOtp("");
            setSuccessMessage(`OTP sent successfully to ${email}`);
        } catch (err: any) {
            setIsLoading(false);
            console.error("Error sending OTP:", err);

            let errorMessage = "Failed to send OTP. Please check server connection.";
            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                errorMessage = typeof detail === "string" ? detail : JSON.stringify(detail);
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        }
    };

    // Verify OTP handler
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (isExpired) {
            setError("OTP has expired. Please request a new code.");
            return;
        }

        if (otp.length !== 6) {
            setError("Please enter the complete 6-digit OTP code");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError("OTP must contain only numbers");
            return;
        }

        setIsLoading(true);

        // Check Test Bypass
        if (isTestEmail(email) || (TEST_BYPASS_ENABLED && otp === TEST_BYPASS_OTP)) {
            setTimeout(() => {
                const mockToken = "mock_test_token_" + Date.now();
                localStorage.setItem("access_token", mockToken);
                localStorage.setItem("authToken", mockToken);
                localStorage.setItem("userEmail", email);
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem(
                    "userData",
                    JSON.stringify({ email, role: "admin", isTest: true })
                );

                setIsLoading(false);
                setStep("success");

                setTimeout(() => {
                    navigate("/adminDashboard");
                }, 1200);
            }, 600);
            return;
        }

        // Real API Call
        try {
            const response = await verifyOTP(email, otp);
            const authData: AuthResponse = response.data;
            const { access_token, refresh_token, user } = authData;

            if (access_token) {
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("authToken", access_token);
            }

            if (refresh_token) {
                localStorage.setItem("refresh_token", refresh_token);
            }

            localStorage.setItem("userEmail", email);
            localStorage.setItem("isAuthenticated", "true");

            if (user) {
                localStorage.setItem("userData", JSON.stringify(user));
            }

            setIsLoading(false);
            setStep("success");

            setTimeout(() => {
                navigate("/adminDashboard");
            }, 1200);
        } catch (err: any) {
            setIsLoading(false);
            console.error("Error verifying OTP:", err);

            let errorMessage = "Invalid OTP. Please check and try again.";
            if (err.response?.status === 401) {
                errorMessage = "Invalid OTP. Please check and try again.";
            } else if (err.response?.status === 400) {
                errorMessage = "Invalid or expired OTP. Please request a new code.";
            } else if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                errorMessage = typeof detail === "string" ? detail : JSON.stringify(detail);
            }

            setError(errorMessage);
        }
    };

    // Resend OTP handler
    const handleResendOtp = async () => {
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        if (isTestEmail(email)) {
            setTimeout(() => {
                setIsLoading(false);
                setTimer(600);
                setIsExpired(false);
                setOtp("");
                setSuccessMessage(`New OTP sent successfully to ${email}`);
            }, 500);
            return;
        }

        try {
            await sendOTP(email);
            setTimer(600);
            setIsExpired(false);
            setOtp("");
            setIsLoading(false);
            setSuccessMessage(`New OTP sent successfully to ${email}`);
        } catch (err: any) {
            setIsLoading(false);
            setError("Failed to resend OTP. Please try again.");
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-white font-sans overflow-hidden">
            {/* Main content */}
            <div className="relative flex-1 flex flex-col justify-center items-center overflow-hidden p-4 sm:p-6 md:p-8">
                {/* Background curve */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-white" />

                {/* 3-Shade Layered Background Waves */}
                <svg
                    className="absolute bottom-0 left-0 w-full pointer-events-none h-[45%] sm:h-[52%] md:h-[60%] lg:h-[65%] transition-all duration-300"
                    viewBox="0 0 1440 520"
                    preserveAspectRatio="none"
                >
                    {/* Layer 1: Lightest Blue (Back) */}
                    <path
                        fill="#93c5fd"
                        fillOpacity="0.6"
                        d="M0,180 C320,400 760,40 1440,10 L1440,520 L0,520 Z"
                    />
                    {/* Layer 2: Medium Vibrant Blue (Middle) */}
                    <path
                        fill="#3b82f6"
                        fillOpacity="0.8"
                        d="M0,250 C360,440 800,100 1440,60 L1440,520 L0,520 Z"
                    />
                    {/* Layer 3: Deep Royal Blue (Front) */}
                    <path
                        fill="#1d4ed8"
                        d="M0,330 C420,470 850,180 1440,120 L1440,520 L0,520 Z"
                    />
                </svg>

                {/* Decorative dot grids */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 grid grid-cols-4 gap-1.5 sm:gap-2 opacity-40">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                    ))}
                </div>
                <div className="absolute top-4 right-4 sm:top-8 sm:right-8 grid grid-cols-4 gap-1.5 sm:gap-2 opacity-40">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                    ))}
                </div>

                {/* Main Container */}
                <div className="relative max-w-7xl mx-auto px-2 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-center w-full my-auto">
                    {/* Left column */}
                    <div className="relative flex flex-col items-center md:items-start text-center md:text-left">
                        {/* Logo */}
                        <a
                            href="#home"
                            className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-3 shrink-0 group mb-4 sm:mb-6"
                        >
                            <div className="shrink-0 rounded-xl border border-slate-200 shadow-xs overflow-hidden group-hover:scale-105 group-hover:border-blue-300 transition-all duration-300 flex items-center justify-center">
                                <img
                                    src={logo}
                                    alt="KGurukul logo"
                                    className="h-10 sm:h-12 md:h-16 w-auto object-contain rounded-lg sm:rounded-xl"
                                />
                            </div>
                            <div className="leading-tight">
                                <p className="font-serif-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 bg-clip-text text-transparent tracking-wide underline decoration-blue-600 underline-offset-4 decoration-4">
                                    KGurukul's
                                </p>
                            </div>
                        </a>

                        {/* Welcome line */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                            Welcome to <span className="text-blue-700">Our Classes</span>
                        </h2>
                        <span className="block h-1 w-12 sm:w-14 bg-blue-700 rounded-full mt-2 sm:mt-3 mb-3 sm:mb-4" />

                        <p className="hidden md:block text-slate-600 text-sm sm:text-base max-w-md sm:max-w-lg leading-relaxed text-center md:text-left">
                            Empowering ICSE, HSC &amp; ISC students with quality computer
                            education and expert guidance for a brighter future.
                        </p>

                        {/* Floating icons (tablet & laptop) */}
                        <CodeRoundedIcon
                            className="absolute -top-2 right-6 lg:right-10 text-blue-200/80 hidden md:block"
                            sx={{ fontSize: { md: 24, lg: 28 } }}
                        />
                        <LaptopMacRoundedIcon
                            className="absolute top-36 lg:top-40 -right-2 lg:right-0 text-blue-200/80 hidden md:block"
                            sx={{ fontSize: { md: 32, lg: 40 } }}
                        />
                        <SchoolRoundedIcon
                            className="absolute top-60 lg:top-64 right-12 lg:right-16 text-blue-200/80 hidden md:block"
                            sx={{ fontSize: { md: 28, lg: 36 } }}
                        />

                        {/* Illustration: login-bg-icon (hidden on mobile) */}
                        <div className="hidden md:flex mt-4 sm:mt-6 w-full justify-center md:justify-start">
                            <img
                                src={loginBgIcon}
                                alt="Login Illustration"
                                className="w-full max-w-[220px] sm:max-w-xs md:max-w-sm lg:max-w-md h-auto object-contain drop-shadow-md"
                            />
                        </div>
                    </div>

                    {/* Right column: login card */}
                    <div className="relative flex justify-center md:justify-end w-full">
                        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl md:shadow-2xl p-5 sm:p-7 md:p-9 border border-slate-100 transition-all duration-300">
                            
                            {/* Error Banner */}
                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start justify-between">
                                    <span>{error}</span>
                                    <button
                                        type="button"
                                        onClick={() => setError("")}
                                        className="ml-2 font-bold text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}

                            {/* Success Banner */}
                            {successMessage && (
                                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start justify-between">
                                    <span>{successMessage}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSuccessMessage("")}
                                        className="ml-2 font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}

                            {/* STEP 1: EMAIL STEP */}
                            {step === "email" && (
                                <>
                                    <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 sm:mb-4">
                                            <PersonOutlineRoundedIcon className="text-blue-700" sx={{ fontSize: { xs: 22, sm: 28 } }} />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                            Login to Your{" "}
                                            <span className="text-blue-700">Account</span>
                                        </h3>
                                        <span className="block h-1 w-10 bg-blue-700 rounded-full mt-1.5 sm:mt-2 mb-2 sm:mb-3" />
                                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                            Access your learning dashboard
                                            <br className="hidden sm:inline" />
                                            {" "}and continue your journey with us.
                                        </p>
                                    </div>

                                    <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-5">
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                                            >
                                                Email ID
                                            </label>
                                            <div className="relative">
                                                <MailOutlineRoundedIcon
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                    sx={{ fontSize: 18 }}
                                                />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email ID"
                                                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-slate-200 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:bg-blue-400 text-white font-semibold py-3 sm:py-3.5 rounded-lg transition shadow-md shadow-blue-800/20 text-sm sm:text-base cursor-pointer"
                                        >
                                            {isLoading ? (
                                                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Send OTP
                                                    <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    
                                </>
                            )}

                            {/* STEP 2: OTP STEP */}
                            {step === "otp" && (
                                <>
                                    <div className="flex items-center justify-between mb-5">
                                        <button
                                            type="button"
                                            onClick={() => setStep("email")}
                                            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-200 transition-all cursor-pointer shadow-xs"
                                        >
                                            <ArrowBackRoundedIcon sx={{ fontSize: 14 }} />
                                            Change Email
                                        </button>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 shadow-xs">
                                            <AccessTimeRoundedIcon className="text-blue-600" sx={{ fontSize: 15 }} />
                                            <span className="text-xs font-extrabold font-mono tracking-wider">
                                                {formatTime(timer)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 sm:mb-4">
                                            <KeyRoundedIcon className="text-blue-700" sx={{ fontSize: { xs: 22, sm: 28 } }} />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                            Enter <span className="text-blue-700">Verification Code</span>
                                        </h3>
                                        <span className="block h-1 w-10 bg-blue-700 rounded-full mt-1.5 sm:mt-2 mb-2 sm:mb-3" />
                                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                            We sent a 6-digit code to
                                            <br />
                                            <span className="font-semibold text-slate-800">{email}</span>
                                        </p>
                                    </div>

                                    <form onSubmit={handleOtpSubmit} className="space-y-4 sm:space-y-5">
                                        <div>
                                            <label
                                                htmlFor="otp"
                                                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                                            >
                                                6-Digit OTP Code
                                            </label>
                                            <div className="relative">
                                                <KeyRoundedIcon
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                    sx={{ fontSize: 18 }}
                                                />
                                                <input
                                                    id="otp"
                                                    type="text"
                                                    maxLength={6}
                                                    required
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                                    placeholder="123456"
                                                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-slate-200 text-center font-mono text-base sm:text-lg tracking-[0.25em] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading || otp.length !== 6}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:bg-blue-300 text-white font-semibold py-3 sm:py-3.5 rounded-lg transition shadow-md shadow-blue-800/20 text-sm sm:text-base cursor-pointer"
                                        >
                                            {isLoading ? (
                                                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Verify &amp; Login
                                                    <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                                                </>
                                            )}
                                        </button>

                                        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100 mt-3">
                                            <span className="font-medium text-slate-600">Didn&apos;t receive code?</span>
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={isLoading || (timer > 540 && !isExpired)}
                                                className="flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900 active:text-blue-950 disabled:text-slate-400 disabled:no-underline underline underline-offset-2 transition cursor-pointer"
                                            >
                                                <RefreshRoundedIcon sx={{ fontSize: 15 }} />
                                                Resend OTP
                                            </button>
                                        </div>
                                    </form>

                                </>
                            )}

                            {/* STEP 3: SUCCESS STEP */}
                            {step === "success" && (
                                <div className="flex flex-col items-center text-center py-6">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600 animate-bounce">
                                        <CheckCircleOutlineRoundedIcon sx={{ fontSize: 40 }} />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                                        Login Successful!
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                        Redirecting to your learning dashboard...
                                    </p>
                                    <span className="inline-block w-6 h-6 border-3 border-blue-700 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}

                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}