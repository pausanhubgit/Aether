import React from "react";

export default function LegalLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0118] py-12 px-4 transition-colors duration-300">
      <div className="container-responsive max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
