import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  TopWSideNav,
  TopNavBar2,
  BottomNav,
  HomeIcon,
  SearchIcon2,
  UserIcon2,
  CogIcon,
  LoginIcon,
} from "liamc9npm";
import { useNotifications } from "../context/NotificationContext";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase auth functions

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useNotifications();

  // Scroll to top whenever the location.pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Paths where TopNavBar should be hidden
  const topNavHiddenPaths = ["/login"];

  // Paths where BottomNavBar should be hidden
  const bottomNavHiddenPaths = ["/login"];

  const shouldHideTopNav = () => topNavHiddenPaths.includes(location.pathname);
  const shouldHideBottomNav = () => bottomNavHiddenPaths.includes(location.pathname);

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

  // Dynamic bottom navigation items based on notification context
  const bottomNavItems = [
    { text: "Home", icon: HomeIcon, path: "/home", hasNotification: notifications.home },
    { text: "Search", icon: SearchIcon2, path: "/search", hasNotification: notifications.search },
    { text: "Profile", icon: UserIcon2, path: "/profile", hasNotification: notifications.profile },
    { text: "Settings", icon: CogIcon, path: "/settings", hasNotification: notifications.settings },
  ];

  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-white">
      {/* Top Navigation Bar */}
      {!shouldHideTopNav() && (
        <>
          {/* Mobile Top Navbar */}
          <div className="md:hidden">
            <TopWSideNav
              appName="MyApp"
              signInColor="#000000"
              navLinks={[
                { name: "Home", path: "/home", Icon: HomeIcon },
                { name: "Web Development", path: "/webdev", Icon: CogIcon },
                { name: "Analytics", path: "/analytics", Icon: LoginIcon },
              ]}
              username="Jane Smith"
              profilePic="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
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
      <div className="mb-16">
      {/* Main Content */}
      <Outlet />
      </div>
    </div>
  );
}