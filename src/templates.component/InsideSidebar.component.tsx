import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import Sidebar from "./Sidebar.component";
import Header from "./Headers.component";

interface InsideSidebarProps {
  children: React.ReactNode;
}

const InsideSidebar: React.FC<InsideSidebarProps> = ({ children }) => {
  // Initialize localStorage state
  const initialIsCollapsed =
    typeof window !== "undefined" &&
    localStorage.getItem("is-collapsed") === "true";
  const initialShowSidebar = false;
  const initialIsMobile =
    typeof window !== "undefined" ? window.innerWidth < 1024 : false;

  // State management
  const [isCollapsed, setIsCollapsed] = useState<boolean>(initialIsCollapsed);
  const [isMobile, setIsMobile] = useState<boolean>(initialIsMobile);
  const [showSidebar, setShowSidebar] = useState<boolean>(initialShowSidebar);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Track dark mode changes
  useEffect(() => {
    const updateTheme = () => {
      document.documentElement.classList.contains("dark");
    };
    updateTheme();
    const obs = new MutationObserver(updateTheme);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth < 1024;
      setIsMobile(nowMobile);

      if (!nowMobile) {
        const storedCollapsed = localStorage.getItem("is-collapsed") === "true";
        setIsCollapsed(storedCollapsed);
        setShowSidebar(false);
      } else {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    if (isMobile) {
      const next = !showSidebar;
      setShowSidebar(next);
      localStorage.setItem("show-side", String(next));
    } else {
      const next = !isCollapsed;
      setIsCollapsed(next);
      localStorage.setItem("is-collapsed", String(next));
    }
  };

  // Handle logout confirmation
  useEffect(() => {
    const handler = () => {
      // Dispatch custom logout event
      window.dispatchEvent(new CustomEvent("user-logout"));
      navigate("/login");
    };
    window.addEventListener("confirm-logout", handler as EventListener);
    return () =>
      window.removeEventListener("confirm-logout", handler as EventListener);
  }, [navigate]);

  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");

    const breadcrumbs = [{ name: "Accueil", path: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ name, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="fixed inset-0 w-screen h-screen bg-linear-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 flex overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar isCollapsed={isCollapsed} />}

      {/* Mobile Sidebar Overlay */}
      {isMobile && showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              isCollapsed={false}
              onCloseMobile={() => setShowSidebar(false)}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`
          flex flex-col h-full overflow-hidden transition-all duration-300
          ${
            isMobile
              ? "w-full"
              : isCollapsed
                ? "w-[calc(100%-5rem)]"
                : "w-[calc(100%-16rem)]"
          }
        `}
      >
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Breadcrumb + Main Content Container */}
        <div className="flex-1 overflow-auto flex flex-col">
          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 1 && (
            <nav className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 relative min-h-12 flex-shrink-0">
              <div className="flex items-center">
                <Home className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                <button
                  onClick={() => navigate("/")}
                  className="text-sm transition-colors duration-200 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                >
                  {breadcrumbs[0].name}
                </button>
              </div>
              {breadcrumbs.slice(1).map((breadcrumb, index) => (
                <div key={breadcrumb.path} className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                  <button
                    onClick={() => navigate(breadcrumb.path)}
                    className={`text-sm transition-colors duration-200 ${
                      index === breadcrumbs.length - 2
                        ? "text-gray-900 dark:text-white font-medium cursor-default"
                        : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                    }`}
                    disabled={index === breadcrumbs.length - 2}
                  >
                    {breadcrumb.name}
                  </button>
                </div>
              ))}
            </nav>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto hide-scrollbar p-4 bg-linear-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 transition-all duration-300">
            {children}
          </main>
        </div>
      </div>

      {/* Logout Modal */}
      
    </div>
  );
};

export default InsideSidebar;
