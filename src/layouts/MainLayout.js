"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const MainLayout = ({ children }) => {
  const { theme } = useSelector((state) => state.userPreferences);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Explicitly toggle the 'dark' class on the root for Tailwind dark: support
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, [theme]);

  // Prevent hydration mismatch by only rendering themed content after mount
  if (!mounted) {
    return <div className="invisible">{children}</div>;
  }

  return (
    <div className={`${theme} min-h-screen w-full overflow-x-hidden transition-colors duration-300`} style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {children}
    </div>
  );
};

export default MainLayout;