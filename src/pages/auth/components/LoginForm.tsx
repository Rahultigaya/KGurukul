import React, { useState, useEffect } from "react";
import { TextInput, Button, PinInput, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconMail,
  IconArrowLeft,
  IconCheck,
  IconAlertCircle,
  IconClock,
} from "@tabler/icons-react";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [isExpired, setIsExpired] = useState(false);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Timer countdown effect
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Manual validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("OTP sent successfully to:", email);
      setIsLoading(false);
      setStep("otp");
      setTimer(60);
      setIsExpired(false);
      setOtp("");
    }, 1500);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Check if OTP is expired
    if (isExpired) {
      setError("OTP has expired. Please request a new code.");
      return;
    }

    // Manual validation
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must contain only numbers");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("OTP verified:", otp);

      // Store authentication data
      localStorage.setItem("authToken", "sample-token-12345");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isAuthenticated", "true");

      setIsLoading(false);
      setStep("success");

      // Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin/dashboard"); // ✅ Updated to new route structure
      }, 1500);
    }, 1500);
  };

  const handleResendOtp = () => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    // Simulate API call for resending OTP
    setTimeout(() => {
      console.log("New OTP sent successfully to:", email);
      setTimer(60);
      setIsExpired(false);
      setOtp("");
      setIsLoading(false);
      setSuccessMessage(`New OTP sent successfully to ${email}`);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }, 1500);
  };

  const handleBack = () => {
    setStep("email");
    setOtp("");
    setError("");
    setSuccessMessage("");
    setTimer(60);
    setIsExpired(false);
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="flex items-center justify-start mb-8">
        <div className="w-10 h-10  rounded-lg flex items-center justify-center">
          <img
            src="/logo-gurukul.png"
            alt="Gurukul"
            className="w-full h-auto object-contain"
          />
        </div>
        <span className="ml-3 text-xl font-semibold text-gray-800">
          KGurukul's Computer Classes
        </span>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <Alert
          icon={<IconCheck size={16} />}
          color="green"
          className="mb-4"
          onClose={() => setSuccessMessage("")}
          withCloseButton
          styles={{
            message: {
              color: "#16a34a",
            },
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          className="mb-4 [&_.mantine-Alert-message]:text-red-600"
          onClose={() => setError("")}
          withCloseButton
          styles={{
            message: {
              color: "#dc2626",
            },
          }}
        >
          {error}
        </Alert>
      )}

      {/* Step 1: Email Entry */}
      {step === "email" && (
        <div className="animate-fade-in">
          <div className="mb-8 mt-14">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Login to your account!
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your registered email address to receive a login code
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <TextInput
                placeholder="eg. pixelteo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                leftSection={<IconMail size={18} className="text-gray-400" />}
                size="md"
                disabled={isLoading}
                className="
    [&_input]:!bg-white
    [&_input]:!text-gray-900
    [&_input]:!border-gray-200
    [&_input:focus]:!bg-white
    [&_input:focus]:!border-purple-600
    [&_input:disabled]:!bg-gray-50
  "
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="md"
              loading={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Send Login Code
            </Button>
          </form>
        </div>
      )}

      {/* Step 2: OTP Entry */}
      {step === "otp" && (
        <div className="animate-fade-in">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            disabled={isLoading}
          >
            <IconArrowLeft size={18} className="mr-2" />
            Back
          </button>

          <div className="mb-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Enter verification code
            </h2>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit code to{" "}
              <span className="font-medium text-gray-800">{email}</span>
            </p>
          </div>

          {/* Timer Display */}
          <div className="mb-1 flex items-center justify-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isExpired
                  ? "bg-red-50 text-red-600"
                  : timer <= 10
                    ? "bg-orange-50 text-orange-600"
                    : "bg-purple-50 text-purple-600"
              }`}
            >
              <IconClock size={18} />
              <span className="font-semibold">
                {isExpired ? "Expired" : formatTime(timer)}
              </span>
            </div>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Verification Code
              </label>
              <PinInput
                length={6}
                value={otp}
                onChange={setOtp}
                size="lg"
                type="number"
                disabled={isLoading || isExpired}
                styles={{
                  input: {
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    textAlign: "center",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    borderColor: "#e5e7eb",
                    "&:focus": {
                      backgroundColor: "#ffffff",
                      borderColor: "#9333ea",
                    },
                    "&:active": {
                      backgroundColor: "#ffffff",
                    },
                    "&:disabled": {
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                    },
                  },
                }}
                className="flex justify-between gap-2"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="md"
              loading={isLoading}
              disabled={otp.length !== 6 || isExpired}
              className="bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:bg-gray-300"
            >
              Verify & Login
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Success */}
      {step === "success" && (
        <div className="animate-fade-in text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <IconCheck size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Login Successful!
          </h2>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;