"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";

const Modal = ({
  showModal,
  setShowModal,
  label,
  icon,
  info,
  confirmAction,
}) => {
  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

  function closeModal() {
    setShowModal(false);
  }

  if (!isBrowser) return null;

  return createPortal(
    <div className={showModal ? "" : "hidden"}>
      <div className="fixed inset-0 z-[9999] flex justify-center items-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/60 backdrop-blur-sm">
        <div className="relative w-max min-w-[500px] mx-auto bg-white dark:bg-[#160327] rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
          <button
            className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
            onClick={closeModal}
          >
            <IoMdClose className="w-5 h-5" />
          </button>

          <div className="p-8 md:p-10 text-center">
            <div className="mb-6">{icon}</div>
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {label}
            </h3>

            <div className="mb-8">{info}</div>

            <div className="flex items-center justify-center gap-4">
              {confirmAction}
              <button
                className="px-8 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition shadow-sm border border-gray-100 dark:border-slate-700"
                onClick={closeModal}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
