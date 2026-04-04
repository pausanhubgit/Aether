"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import Link from "next/link";
import authAPI from "@/api/auth";
const { resetPassword } = authAPI;
import { toast } from "react-toastify";
import { Suspense, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LOGIN_ROUTE } from "@/constants/routes";

const ResetPasswordForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const identifier = searchParams.get("identifier");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValue = watch("password");

  function submitForm(data) {
    if (!userId) {
      toast.error("Invalid or missing user identification.");
      return;
    }

    setLoading(true);

    resetPassword({
      userId,
      code: data.code,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
      .then(() => {
        toast.success("Password reset successful! Please login with your new password.", {
          autoClose: 2000,
        });
        reset();
        setTimeout(() => {
          router.push(LOGIN_ROUTE);
        }, 2000);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.response?.data || "Failed to reset password. Code may be invalid or expired.";
        toast.error(errorMessage, {
          autoClose: 3000,
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:bg-[#160327] dark:border-gray-800">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Reset password</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter the code sent to {identifier || "your device"} and choose a new password.
        </p>
      </div>

      <form
        className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5 dark:bg-[#160327] dark:border-gray-800"
        onSubmit={handleSubmit(submitForm)}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reset Code (6 Digits)</label>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#160327] dark:border-gray-700 dark:text-white"
            placeholder="123456"
            {...register("code", {
              required: "Reset code is required.",
              minLength: { value: 6, message: "Code must be 6 digits." },
              maxLength: { value: 6, message: "Code must be 6 digits." }
            })}
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#160327] dark:border-gray-700 dark:text-white pr-10"
              placeholder="••••••••"
              {...register("password", {
                required: "New password is required.",
                minLength: { value: 8, message: "Password must be at least 8 characters." }
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#160327] dark:border-gray-700 dark:text-white pr-10"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Confirm password is required.",
                validate: (value) => value === passwordValue || "Passwords do not match"
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button 
          loading={loading} 
          label={loading ? "Resetting..." : "Reset Password"} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all py-2.5 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none"
        />

        <div className="text-center pt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
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

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;