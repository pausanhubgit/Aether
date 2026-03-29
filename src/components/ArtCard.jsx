"use client";

import Image from "next/image";
import Link from "next/link";
import { FaCartPlus, FaImage, FaStar, FaEye } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cart/cartSlice";
import { toast } from "react-toastify";
import { ART_ROUTE } from "@/constants/routes";

const ArtCard = ({ art }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Aligned with cartSlice requirement (expects art or artId object)
    dispatch(addToCart(art));
    toast.success(`${art.title || art.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="group bg-white dark:bg-[#160327] rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-purple-900/40 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white dark:bg-[#0d0118]">
        {((art.imageUrls?.length > 0 && art.imageUrls[0]) || art.image) ? (
          <Image
            src={art.imageUrls?.[0] || art.image}
            alt={art.title || art.name || "Artwork"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <FaImage size={48} />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
             <Link 
                href={`${ART_ROUTE}/${art._id}`}
                className="p-3 bg-white text-slate-900 rounded-full hover:bg-primary hover:text-white transition-colors shadow-lg"
                title="View Details"
             >
                <FaEye size={18} />
             </Link>
        </div>

        {art.likes?.length > 10 && (
          <span className="absolute top-4 left-4 bg-amber-400 text-amber-950 font-semibold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-slate-800 dark:text-purple-100 line-clamp-1">
                {art.title || art.name}
            </h3>
            <div className="flex items-center gap-1 text-amber-500">
                <FaStar size={12} />
                <span className="text-xs font-bold">{art.likes?.length || 0}</span>
            </div>
        </div>
        
        <p className="text-slate-500 dark:text-purple-300/70 text-sm line-clamp-2 mb-4 flex-grow">
            {art.description || "Beautiful handcrafted artwork available for your collection."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-purple-900/30">
          <div>
            <p className="text-[10px] text-slate-400 dark:text-purple-400/60 uppercase font-bold tracking-widest mb-1">Price</p>
            <p className="text-xl font-semibold text-primary">
              Rs.{art.price || 0}
            </p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 md:gap-2 bg-primary text-white px-3.5 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold text-[11px] md:text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap group/btn"
          >
            <FaCartPlus className="text-sm md:text-base transition-transform group-hover/btn:-rotate-12" />
            <span>Add To Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
