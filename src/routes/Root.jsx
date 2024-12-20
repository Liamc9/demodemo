// src/routes/Root.js
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  HomeIcon3,
  SearchIcon2,
  UserIcon3,
  CogIcon,
  LoginIcon,
  BookOpenIcon,
  ChatIcon,
} from "../components/icons/Icons";
import { useNotifications } from "../context/NotificationContext";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase auth functions
import { useAuth } from "../context/AuthContext"; // Import AuthContext for currentUser
import TopWSideNav from "../components/navigation/TopWSideNav";
import TopNavBar2 from "../components/navigation/TopNavBar2";
import BottomNav from "../components/navigation/BottomNav";

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
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

  // Paths where TopNavBar should be hidden
  const topNavHiddenPaths = [
    "/login",
    "/explore",
    "/listing",
    "/messages",
    "/settings/:id",
    "/settings/manageaccount",
    "/rooms/:id",
    "/profile/:id",
    "/conversation/:id",
  ];

  // Paths where BottomNavBar should be hidden
  const bottomNavHiddenPaths = ["/login", "/rooms/:id", "/conversation/:id"];

  const shouldHideTopNav = () =>
    topNavHiddenPaths.some((path) => matchesPath(path));
  const shouldHideBottomNav = () =>
    bottomNavHiddenPaths.some((path) => matchesPath(path));

  // Firebase Logout Function
  const handleLogout = async () => {
    const auth = getAuth(); // Get Firebase Auth instance
    try {
      await signOut(auth); // Sign out the user
      console.log("User logged out");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Dynamic bottom navigation items based on notification context and currentUser
  const bottomNavItems = [
    { text: "Explore", icon: SearchIcon2, path: "/explore", hasNotification: notifications.explore },
    { text: "Listing", icon: HomeIcon3, path: "/listing", hasNotification: notifications.listing },
    { text: "Messages", icon: ChatIcon, path: "/messages", hasNotification: notifications.messages },
    { 
      text: "Account", 
      icon: UserIcon3, 
      path: currentUser ? `/settings/${currentUser.uid}` : "/login", // Dynamic user ID path or login fallback
      hasNotification: notifications.account,
    },
  ];

  return (
    <div id="root" className="w-full overflow-x-hidden bg-white">
      {/* Top Navigation Bar */}
      {!shouldHideTopNav() && (
        <>
          {/* Mobile Top Navbar */}
          <div className="md:hidden">
            <TopWSideNav
              appName="MyApp"
              signInColor="#000000"
              navLinks={[
                { name: "Home", path: "/home", Icon: HomeIcon3 },
                { name: "Web Development", path: "/webdev", Icon: CogIcon },
                { name: "Analytics", path: "/analytics", Icon: LoginIcon },
              ]}
              username={currentUser?.displayName || "Guest"}
              profilePic={currentUser?.photoURL || "https://via.placeholder.com/50"}
              onLogout={handleLogout} // Pass the Firebase logout function
            />
          </div>
          {/* Desktop Top Navbar */}
          <div className="hidden md:block">
            <TopNavBar2 menuItems={["Home", "About", "Services", "Contact"]} activeTab="Services" />
          </div>
        </>
      )}

      {/* Bottom Navigation Bar */}
      {!shouldHideBottomNav() && (
        <div className="md:hidden">
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
