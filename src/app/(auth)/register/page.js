"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from "@/redux/auth/authActions";

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        phone: data.phone,
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
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            placeholder="Your Phone Number"
            {...register("phone", {
              required: "Phone is required",
            })}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
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
            onChange={(e) => setPasswordValue(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === passwordValue || "Passwords do not match"
            })}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="w-full rounded-xl bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition">
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account? <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">Login</Link>
      </p>
    </div>
  );
};

export default Register;
