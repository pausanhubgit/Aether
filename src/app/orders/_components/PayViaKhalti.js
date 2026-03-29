"use client";
import Image from "next/image";
import khaltiIcon from "@/assets/images/arts/default-image-missing-placeholder-free-vector.jpg";
import { toast } from "react-toastify";
import orderApi from "@/api/order";

const PayViaKhalti = ({ order }) => {
  function initOrderPayment() {
    orderApi.payViaKhalti(order._id, {
      return_url: `${window.location.origin}/order-status`,
      website_url: window.location.origin,
    })
      .then((response) => {
        const data = response.data;

        if (typeof window !== "undefined") {
          window.location.href = data.payment_url;
        }
      })
      .catch((error) => {
        toast.error(error.response.data, { autoClose: 1500 });
      });
  }

  return (
    <button
      onClick={initOrderPayment}
      className="text-white bg-[#4E2C6D] hover:bg-[#4e2c6dbe] cursor-pointer rounded-md flex items-center text-sm pl-2 pr-4 py-1 gap-2"
    >
      <Image
        src={khaltiIcon}
        height={30}
        width={100}
        alt=""
        className="h-5 w-auto"
      />
      Khalti
    </button>
  );
};

export default PayViaKhalti;