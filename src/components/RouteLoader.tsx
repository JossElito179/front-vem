import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteLoader = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const isDarkMode =
    typeof window !== "undefined" &&
    window.document.documentElement.classList.contains("dark");

  useEffect(() => {
    setIsVisible(true);

    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden backdrop-blur-sm ${
        isDarkMode ? "bg-slate-950/25" : "bg-white/35"
      }`}
    >
      <div
        className="absolute left-0 top-0 h-1 w-1/3 rounded-r-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.65)]"
        style={{ animation: "route-loader-slide 0.9s ease-in-out infinite" }}
      />
      <style>{`
        @keyframes route-loader-slide {
          0% {
            transform: translateX(-100%);
            opacity: 0.85;
          }
          50% {
            transform: translateX(150%);
            opacity: 1;
          }
          100% {
            transform: translateX(320%);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
};

export default RouteLoader;