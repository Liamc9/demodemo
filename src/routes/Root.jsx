// src/routes/Root.js
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  HomeIcon3,
  SearchIcon2,
  UserIcon3,
  ChatIcon,
} from "../components/icons/Icons";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext"; // Import AuthContext for currentUser
import BottomNav from "../components/navigation/BottomNav";

export default function Root() {
  const location = useLocation();
  const { notifications } = useNotifications();
  const { currentUser } = useAuth(); // Access currentUser from AuthContext

  // Scroll to top whenever the location.pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Helper function to check if a path matches the current route, including dynamic paths
  const matchesPath = (pathPattern) => {
    const regex = new RegExp(`^${pathPattern.replace(":id", "[^/]+")}$`);
    return regex.test(location.pathname);
  };

  // Paths where BottomNavBar should be hidden
  const bottomNavHiddenPaths = ["/login", "/rooms/:id", "/conversation/:id"];

  const shouldHideBottomNav = () =>
    bottomNavHiddenPaths.some((path) => matchesPath(path));

  // Dynamic bottom navigation items based on notification context and currentUser
  const bottomNavItems = [
    { text: "Explore", icon: SearchIcon2, path: "/explore", key: 'explore' },
    { text: "Listing", icon: HomeIcon3, path: "/listing", key: 'listing' },
    { text: "Messages", icon: ChatIcon, path: "/messages", key: 'messages' },
    { 
      text: "Account", 
      icon: UserIcon3, 
      path: currentUser ? `/settings/${currentUser.uid}` : "/login", 
      key: 'account', 
    },
  ];

  return (
    <div id="root" className="w-full overflow-x-hidden bg-white">
      {/* Bottom Navigation Bar */}
      {!shouldHideBottomNav() && (
        <div>
          <BottomNav items={bottomNavItems} />
        </div>
      )}

      {/* Main Content with Conditional Margin */}
      <div className={!shouldHideBottomNav() ? "pb-16" : ""}>
        <Outlet />
      </div>
    </div>
  );
}
