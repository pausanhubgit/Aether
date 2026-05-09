"use client";
import Image from "next/image";
import khaltiIcon from "@/assets/images/payment/khalti.png";
import { toast } from "react-toastify";
import orderApi from "@/api/order";

const PayViaKhalti = ({ order }) => {
  function initOrderPayment() {
    toast.info("Redirecting to Khalti...", { autoClose: 1000 });

    orderApi
      .payViaKhalti(order._id, {
        return_url: `${window.location.origin}/orders/${order._id}/payment/khalti`,
        website_url: window.location.origin,
      })

      .then((response) => {
        const data = response.data;
        if (typeof window !== "undefined" && data.payment_url) {
          window.location.href = data.payment_url;
        }
      })
      .catch((error) => {
        toast.error(error.response?.data || "Payment initialization failed", {
          autoClose: 1500,
        });
      });
  }

  return (
    <button
      onClick={initOrderPayment}
      className="text-white bg-[#4E2C6D] hover:bg-[#5e3882] cursor-pointer rounded-md flex items-center text-sm px-3 py-1 gap-2 border border-[#4E2C6D]"
    >
      <Image
        src={khaltiIcon}
        height={30}
        width={100}
        alt="Khalti"
        className="h-5 w-auto"
      />
      Khalti
    </button>
  );
};

export default PayViaKhalti;
