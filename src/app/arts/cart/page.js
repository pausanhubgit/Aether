"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaTrash, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  removeFromCart,
  fetchCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cart/cartSlice";
import cartApi from "@/api/cart";
import { formatImageUrl } from "@/helpers/url";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, total, loading } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = async (item) => {
    const artId = item.artId?._id || item._id;
    try {
      if (isAuthenticated) {
        await cartApi.removeFromCart(artId);
      }
      dispatch(removeFromCart(item));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (!isAuthenticated && items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <FaShoppingCart className="mx-auto text-gray-300 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8">
          Login to save your cart or browse our collection.
        </p>
        <Link
          href="/arts"
          className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition shadow-md"
        >
          Back to Arts
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-purple-600 font-bold">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl transition-colors duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/arts"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 transition"
          >
            <FaArrowLeft size={16} />
            Back to Arts
          </Link>
          <h1 className="text-4xl font-semibold text-black dark:text-white tracking-tight">
            Shopping Cart
          </h1>
        </div>
        <div className="text-right">
          <p className="text-gray-500 dark:text-purple-400/60 font-medium">
            Items in Cart
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {items.length}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-[#160327] rounded-3xl border border-gray-100 dark:border-purple-900/30 p-12 text-center shadow-sm">
          <FaShoppingCart className="mx-auto text-purple-100 dark:text-purple-900/40 text-7xl mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-purple-100 mb-2">
            Cart is empty
          </h2>
          <Link
            href="/arts"
            className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
          >
            Go browse some art!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              // Support both backend shape {artId: {...}} and local flat shape {_id, title, ...}
              const art =
                item.artId && typeof item.artId === "object"
                  ? item.artId
                  : item;
              const artId = art._id || art.id || item._id;
              const imageUrl = art.imageUrls?.[0] || art.image || null;
              const price = art.price || item.price || 0;
              return (
                <div
                  key={artId ? `${artId}-${index}` : index}
                  className="bg-white dark:bg-[#160327] border border-gray-100 dark:border-purple-900/30 rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition"
                >
                  <div className="h-24 w-24 relative flex-shrink-0 rounded-xl overflow-hidden shadow-inner bg-gray-50 dark:bg-purple-950/20">
                    <Image
                      src={
                        imageUrl
                          ? formatImageUrl(imageUrl)
                          : "/assets/images/placeholder.jpg"
                      }
                      alt={art.title || art.name || "Artwork"}
                      fill
                      sizes="(max-width: 768px) 96px, 96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-black dark:text-purple-100 truncate">
                      {art.title || art.name || "Artwork"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-purple-400/60 mb-2">
                      {art.category || ""}
                    </p>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold text-lg">
                      Rs. {Number(price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleRemove(item)}
                      className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition"
                      title="Remove"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#11041f] border border-gray-100 dark:border-purple-900/40 rounded-3xl p-6 shadow-xl sticky top-24 overflow-hidden">
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 dark:text-purple-300">
                  <span>Subtotal</span>
                  <span className="font-bold">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-purple-300">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    Free
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-purple-900/30 flex justify-between">
                  <span className="text-xl font-bold text-black dark:text-white">
                    Total
                  </span>
                  <span className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/arts/checkout")}
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-purple-700 transition transform active:scale-95 shadow-lg shadow-purple-200 dark:shadow-purple-900/20"
              >
                Proceed to Checkout
              </button>

              <p className="text-center text-xs text-gray-400 dark:text-purple-400/40 mt-6">
                Taxes are calculated if applicable at checkout
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
