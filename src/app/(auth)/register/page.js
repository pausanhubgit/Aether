"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginWithGoogle } from "@/redux/auth/authActions";
import { FaEye, FaEyeSlash, FaEnvelope, FaPhone } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/constants/countries";

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Verification State
  const [verificationMethod, setVerificationMethod] = useState("email"); // 'email' or 'phone'
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.dialCode === '+977') || DEFAULT_COUNTRY);
  
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
      toast.success("Login with Google successful!", { autoClose: 2000 });
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      toast.error(err || "Google login failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign In was unsuccessful. Try again later.");
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const emailValue = watch("email");
  const phoneValue = watch("phone");

  const sendOtpCode = async () => {
    let contactInfo = verificationMethod === "email" ? emailValue : phoneValue;
    if (!contactInfo) {
      toast.error(`Please enter your ${verificationMethod} first`);
      return;
    }
    
    // Prepend dial code for phone verification
    if (verificationMethod === "phone") {
      contactInfo = `${selectedCountry.dialCode}${contactInfo}`;
    }
    
    setSendingOtp(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.post(`${apiUrl}/api/auths/send-otp`, {
        contactInfo,
        method: verificationMethod
      });
      setOtpSent(true);
      toast.success("Verification code sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtpCode = async () => {
    let contactInfo = verificationMethod === "email" ? emailValue : phoneValue;
    
    if (verificationMethod === "phone") {
      contactInfo = `${selectedCountry.dialCode}${contactInfo}`;
    }
    
    setVerifyingOtp(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.post(`${apiUrl}/api/auths/verify-otp`, {
        contactInfo,
        otp
      });
      setIsVerified(true);
      toast.success("Verification successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const submitForm = async (data) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const result = await dispatch(registerUser({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        username: data.name,
        phone: data.phone ? `${selectedCountry.dialCode}${data.phone}` : undefined,
      })).unwrap();

      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => router.push("/"), 1500);
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error || "Registration failed", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-medium text-black">Create an account</h1>
        <p className="mt-2 text-sm text-gray-600">Sign up to get started with Aether</p>
      </div>

      <form onSubmit={handleSubmit(submitForm)} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            {...register("name", { required: "Name is required" })}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", { 
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
              })}
              disabled={isVerified}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            />
            {!isVerified && (
              <button
                type="button"
                onClick={sendOtpCode}
                disabled={sendingOtp}
                className="rounded-xl bg-purple-100 px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-200 transition disabled:opacity-50"
              >
                {sendingOtp ? "Sending..." : otpSent ? "Resend" : "Send Code"}
              </button>
            )}
          </div>

          {otpSent && !isVerified && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-medium text-gray-500">Enter Verification Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={verifyOtpCode}
                  disabled={verifyingOtp || otp.length < 6}
                  className="rounded-xl bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 transition"
                >
                  {verifyingOtp ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          )}
          {isVerified && <p className="text-xs text-green-600 font-medium">✓ Verified successfully</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === passwordValue || "Passwords do not match"
              })}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={!isVerified || loading} 
          className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Complete Registration"}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center w-full mt-4">
          <div className="w-full max-w-[400px] flex justify-center overflow-hidden">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signup_with"
              shape="pill"
              width="100%"
            />
          </div>
        </div>

      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account? <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">Login</Link>
      </p>
    </div>
  );
};

export default Register;
