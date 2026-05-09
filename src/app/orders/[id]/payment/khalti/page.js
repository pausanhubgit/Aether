"use client";

import orderApi from "@/api/order";
import { ORDER_STATUS_CONFIRMED } from "@/constants/orderStatus";
import { ORDERS_ROUTE } from "@/constants/routes";
import { toast } from "react-toastify";
import { useEffect, Suspense, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";

const KhaltiPaymentContent = () => {
  const searchParams = useSearchParams();
  const status = searchParams?.get("status");
  const params = useParams();

  const router = useRouter();

  const [paymentState, setPaymentState] = useState("verifying");

  useEffect(() => {
    orderApi
      .confirmPayment(params.id, { status })
      .then(() => {
        setPaymentState("success");
      })
      .catch(() => {
        setPaymentState("failed");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d0118] px-4 py-20 pb-32">
      <div className="bg-white dark:bg-[#160327] max-w-lg w-full rounded-[3rem] shadow-2xl border border-gray-100 dark:border-purple-900/40 p-10 text-center relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {paymentState === "verifying" && (
            <div className="flex flex-col items-center justify-center">
              <Spinner className="h-16 w-16 text-purple-600 animate-spin mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Verifying Payment
              </h2>
              <p className="text-gray-500 mt-2">
                Please wait while we confirm your Khalti transaction...
              </p>
            </div>
          )}

          {paymentState === "success" && (
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/40 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                Your Khalti transaction has been securely processed. Your order
                is now confirmed.
              </p>
              <button
                onClick={() =>
                  router.push(
                    `${ORDERS_ROUTE}?status=${ORDER_STATUS_CONFIRMED}`,
                  )
                }
                className="px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/30 hover:bg-purple-700 hover:scale-105 transition-all w-full leading-none"
              >
                View My Orders
              </button>
            </div>
          )}

          {paymentState === "failed" && (
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/40 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                There was an issue verifying your transaction. Please try again
                or contact support.
              </p>
              <button
                onClick={() => router.push(ORDERS_ROUTE)}
                className="px-8 py-4 bg-gray-900 dark:bg-[#2c1348] text-white font-bold rounded-2xl shadow-xl shadow-gray-900/30 hover:bg-black dark:hover:bg-[#341854] hover:-translate-y-1 transition-all w-full leading-none"
              >
                Return to Orders
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const KhaltiPaymentPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner className="h-12 w-12 fill-primary" />
          <h2 className="mt-5 text-3xl text-gray-400">
            Loading payment details...
          </h2>
        </div>
      }
    >
      <KhaltiPaymentContent />
    </Suspense>
  );
};

export default KhaltiPaymentPage;
