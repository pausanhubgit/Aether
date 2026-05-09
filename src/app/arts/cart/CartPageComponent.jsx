"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/lib/slices/cartSlice";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import Link from "next/link";

function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Shopping Cart
        </h1>
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Your cart is empty
          </p>
          <Link
            href="/arts"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Shopping Cart
      </h1>

      {/* Cart Table */}
      <div className="overflow-x-auto bg-white dark:bg-[#160327] rounded-lg shadow-lg mb-6">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-[#160327] border-b border-gray-300 dark:border-gray-600">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">
                Product
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">
                Price
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">
                Quantity
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800 dark:text-white">
                Subtotal
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-800 dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {item.title || item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Merchant: {item.merchantName || "Unknown"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                  Rs. {item.price}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#160327] rounded-lg w-fit p-1">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-primary transition"
                    >
                      <FaMinus size={14} />
                    </button>
                    <span className="px-3 py-1 text-gray-800 dark:text-white font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-primary transition"
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 mx-auto"
                  >
                    <FaTrash size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2"></div>
        <div className="bg-white dark:bg-[#160327] rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Order Summary
          </h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Subtotal:</span>
              <span className="font-semibold">Rs. {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Shipping:</span>
              <span className="font-semibold">Rs. 0.00</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Tax:</span>
              <span className="font-semibold">
                Rs. {(total * 0.1).toFixed(2)}
              </span>
            </div>
            <hr className="border-gray-300 dark:border-gray-600" />
            <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white">
              <span>Total:</span>
              <span>Rs. {(total + total * 0.1).toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                toast.info("Please login to proceed with your order.");
                router.push("/login?redirect=/checkout");
              } else {
                router.push("/checkout");
              }
            }}
            className="w-full block text-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold mb-3 cursor-pointer"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={handleClearCart}
            className="w-full px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 transition font-semibold"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
