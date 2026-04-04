"use client";

import { EMAIL_REGEX } from "@/constants/regex";
import { LOGIN_ROUTE } from "@/constants/routes";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import Link from "next/link";
import authAPI from "@/api/auth";
const { forgotPassword } = authAPI;
import { toast } from "react-toastify";
import { useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/constants/countries";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("email"); // 'email' or 'phone'
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);

  const identifierValue = watch("identifier");

  function submitForm(data) {
    setLoading(true);
    const identifier = method === "email" ? data.identifier : `${selectedCountry.dialCode}${data.identifier}`;

    forgotPassword({
      identifier,
      method,
      redirectUrl: `${window.location.origin}/reset-password`
    })
      .then(() => {
        toast.success(`Reset code sent successfully to your ${method}.`);
        // Redirect to reset password page with userId if returned, 
        // or just let them go there (backend usually returns a message)
        router.push(`/reset-password?identifier=${encodeURIComponent(identifier)}&method=${method}`);
      })
      .catch((error) => {
        console.error("[FORGOT PASSWORD] Error:", error);
        toast.error(error.response?.data?.message || "Failed to send reset code.");
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:bg-[#160327] dark:border-gray-800">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Forgot password?</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No worries! Enter your email and we'll send you a reset code.</p>
      </div>

      <form
        className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5 dark:bg-[#160327] dark:border-gray-800"
        onSubmit={handleSubmit(submitForm)}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#160327] dark:border-gray-700 dark:text-white"
            placeholder="you@example.com"
            {...register("identifier", {
              required: "Email is required.",
              pattern: {
                value: EMAIL_REGEX,
                message: "Please enter a valid email address.",
              }
            })}
          />
          {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier.message}</p>}
        </div>

        <div className="flex items-start gap-3 py-2">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              required
              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <label
            htmlFor="terms"
            className="text-xs text-gray-500 dark:text-gray-400"
          >
            I accept the <span className="text-purple-600 hover:underline cursor-pointer">Terms and Conditions</span>
          </label>
        </div>

        <Button 
          loading={loading} 
          label={loading ? "Sending Code..." : "Send Reset Code"} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all py-2.5 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none"
        />

        <div className="text-center pt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remembered your password?{" "}
            <Link
              href={LOGIN_ROUTE}
              className="font-medium text-purple-600 hover:text-purple-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
