"use client";

import { addToCart } from "@/redux/cart/cartSlice";
import { FaCartPlus, FaShare, FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";

const AddToCart = ({ art, Art, product, label }) => {
  const dispatch = useDispatch();
  const artInfo = art || Art || product;
  const [added, setAdded] = useState(false);

  function addArtToCart() {
    if (!artInfo) {
      toast.error("Art data is missing.");
      return;
    }
    const artToAdd = { ...artInfo };
    delete artToAdd.description;
    dispatch(addToCart(artToAdd));

    toast.success(`${artInfo.title || artInfo.name || "Art"} added to cart!`, {
      autoClose: 750,
    });

    // Trigger "added" animation
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function shareArt() {
    if (!artInfo) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = artInfo.title || artInfo.name || "Art";
    const text = `Check out this art: ${title} - ${artInfo.description || ""}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, "_blank");
  }

  if (label) {
    // Full-size button used on detail page
    return (
      <>
        <style>{`
          .atc-btn-full {
            position: relative;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            padding: 0.9rem 2rem;
            border-radius: 0.9rem;
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 0.02em;
            cursor: pointer;
            border: none;
            outline: none;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            flex: 1;
            min-width: 160px;
          }
          .atc-btn-full.idle {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            box-shadow: 0 4px 20px rgba(99,102,241,0.4);
          }
          .atc-btn-full.idle:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 30px rgba(99,102,241,0.6);
          }
          .atc-btn-full.idle:active {
            transform: scale(0.97);
          }
          .atc-btn-full.done {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: #fff;
            box-shadow: 0 4px 20px rgba(34,197,94,0.4);
            transform: scale(1.02);
          }
          .atc-ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            width: 200%;
            padding-top: 200%;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
          }
          @keyframes ripple {
            to { transform: translate(-50%,-50%) scale(1); opacity: 0; }
          }
          .atc-share-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 3rem;
            height: 3rem;
            border-radius: 0.9rem;
            background: rgba(255,255,255,0.07);
            border: 1px solid rgba(255,255,255,0.12);
            color: rgba(255,255,255,0.6);
            cursor: pointer;
            transition: all 0.2s;
            flex-shrink: 0;
          }
          .atc-share-btn:hover {
            background: rgba(167,139,250,0.15);
            border-color: rgba(167,139,250,0.4);
            color: #a78bfa;
            transform: rotate(15deg) scale(1.1);
          }
        `}</style>
        <button
          onClick={addArtToCart}
          className={`atc-btn-full ${added ? "done" : "idle"}`}
        >
          {added ? (
            <>
              <FaCheck /> Added to Cart!
            </>
          ) : (
            <>
              <FaCartPlus /> {label}
            </>
          )}
        </button>
        <button onClick={shareArt} className="atc-share-btn" title="Share via WhatsApp">
          <FaShare />
        </button>
      </>
    );
  }

  // Compact icon-only button (used in cards)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <button
        onClick={addArtToCart}
        title="Add to cart"
        style={{
          background: added ? "#22c55e" : "transparent",
          border: "none",
          cursor: "pointer",
          color: added ? "#fff" : "currentColor",
          padding: "0.35rem",
          borderRadius: "0.4rem",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem"
        }}
      >
        {added ? <FaCheck /> : <FaCartPlus />}
      </button>
      <button
        onClick={shareArt}
        title="Share"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "currentColor",
          padding: "0.35rem",
          display: "flex",
          alignItems: "center"
        }}
      >
        <FaShare />
      </button>
    </div>
  );
};

export default AddToCart;