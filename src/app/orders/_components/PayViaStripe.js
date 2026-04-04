import orderApi from "@/api/order";
import Modal from "@/components/Modal";
import config from "@/config";
import { ORDER_STATUS_CONFIRMED } from "@/constants/orderStatus";
import { ORDERS_ROUTE } from "@/constants/routes";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegCreditCard } from "react-icons/fa6";
import { toast } from "react-toastify";

const CheckoutForm = ({ order }) => {
  const [showModal, setShowModal] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter()

  async function initPayment() {
    if (!stripe || !elements) return;
    
    try {
      toast.info("Initializing secure payment...", { autoClose: 1000 });
      const response = await orderApi.payViaStripe(order._id);
      const clientSecret = response.data?.client_secret;

      if (!clientSecret) throw new Error("Could not retrieve payment secret.");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: order.userid?.username || "Customer",
            email: order.userid?.email || "",
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        await orderApi.confirmPayment(order._id, { status: "completed" });
        toast.success("Payment successful! Redirecting...", {
          autoClose: 2000,
          onClose: () => {
            router.push(`${ORDERS_ROUTE}?status=${ORDER_STATUS_CONFIRMED}`);
          },
        });
        setShowModal(false);
      }
    } catch (err) {
      console.error("Stripe Error:", err);
      toast.error(err.message || "Payment processing failed. Please try again.");
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer rounded-md flex items-center text-sm px-3 py-1.5 gap-2 transition"
      >
        <FaRegCreditCard className="w-4 h-4" />
        Pay with Card
      </button>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        label={"Secure Card Payment"}
        info={
          <div className="mt-4">
            <div className="p-4 mb-6 text-sm text-indigo-800 rounded-xl bg-indigo-50 dark:bg-[#1a0b35] dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 shadow-sm" role="alert">
              <div className="flex items-center gap-2 mb-2 font-bold text-base">
                <span>💳 Test Mode — Card Payment</span>
              </div>
              <p className="mb-1 opacity-90 text-xs">Payment processed in <strong>USD</strong> (Stripe converts from NPR).</p>
              <p className="mb-2 opacity-90">Use the test card below:</p>
              <div className="bg-white dark:bg-[#0f041d] px-4 py-3 rounded-lg border border-indigo-200 dark:border-indigo-800 font-mono text-xl font-bold text-center tracking-[.25em] text-indigo-700 dark:text-indigo-400">
                4242 4242 4242 4242
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-wider opacity-60 text-center">Exp: 12/26 • CVC: 123 • ZIP: 10001</p>
            </div>
            
            <div className="space-y-4">
               <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">Card Details</label>
               <div className="border border-gray-200 dark:border-purple-900/50 p-4 rounded-xl bg-gray-50 dark:bg-[#0f041d] transition-shadow focus-within:ring-2 focus-within:ring-indigo-500">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ffffff' : '#1a1a1a',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#ef4444',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        }
        icon={
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaRegCreditCard className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
          </div>
        }
        confirmAction={
          <button
            onClick={initPayment}
            className="w-full py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            Authorize Payment
          </button>
        }
      />
    </>
  );
};


const PayViaStripe = ({ order }) => {
  const stripePromise = loadStripe(config.stripeKey);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm order={order} />
    </Elements>
  );
};

export default PayViaStripe;