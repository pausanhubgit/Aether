"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, loginWithGoogle } from "@/redux/auth/authActions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

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
    formState: { errors },
  } = useForm();

  const submitForm = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => router.push("/"), 1500);
    } catch (error) {
      console.log('Login error details:', error); // Debug log
      const errorMessage =
        (typeof error === 'string' && error) ||
        error?.message ||
        error?.error ||
        error?.data?.message ||
        error?.data?.error ||
        (error?.response?.data?.message) ||
        (error?.response?.data?.error) ||
        (typeof error?.response?.data === 'string' && error.response.data) ||
        (!error?.response ? 'Network error. Please check your connection.' :
          (typeof error === 'object' && Object.keys(error).length > 0 && !Array.isArray(error) ?
            Object.values(error).find(val => typeof val === 'string' && val) : null)) ||
        "Invalid email or password. Please try again!";

      console.error("Login failed:", error);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-medium text-black">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600">Login to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit(submitForm)} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
            })}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full rounded-xl bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center flex-col items-center gap-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signin_with"
            shape="circle"
            width="340"
          />
        </div>

        <div className="text-right">
          <Link href="/forgot-password" title="Forgot Password?" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            Forgot password?
          </Link>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account? <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
