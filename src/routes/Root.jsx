import { Outlet, useLocation } from "react-router-dom";
        import { useEffect } from "react";
        import { TopNavBar2, TopNavBar, BottomTabs2, HomeIcon2, StrategyIcon, PeriodIcon, SecurityIcon, SettingsIcon } from 'liamc9npm';

        export default function Root() {
          const location = useLocation();
  console.log(HomeIcon2, TopNavBar2)
          // Scroll to top whenever the location.pathname changes
          useEffect(() => {
            window.scrollTo(0, 0);
          }, [location.pathname]);
  
          // Function to determine if the BottomNavBar should be hidden
          const shouldHideBottomNavBar = () => {
            // List the paths where BottomNavBar should be hidden
            const pathsToHide = ["/login"];
            return pathsToHide.includes(location.pathname);
          };
  
          const shouldHideTopNav = () => {
            // List the paths where TopNavBar should be hidden
            const pathsToHide = ["/login"];
            return pathsToHide.includes(location.pathname);
          };

          return (
            <>
              <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-white">
                <div className="md:hidden">
                {!shouldHideTopNav() &&     <TopNavBar/>                }

                {!shouldHideBottomNavBar() && 
                  <BottomTabs2
      items={[
        { text: 'home', icon: <HomeIcon2 className='w-6 h-6'/>, path: '/home' },
        { text: 'strategy', icon: <StrategyIcon className='w-6 h-6'/>, path: '/strategy' },
        { text: 'period', icon: <PeriodIcon />, path: '/period' },
        { text: 'security', icon: <SecurityIcon />, path: '/security' },
        { text: 'settings', icon: <SettingsIcon />, path: '/settings' },
      ]}
    />}
                </div>
                <div className="hidden md:block">
                {!shouldHideTopNav() &&     <TopNavBar2 menuItems={['Home', 'About', 'Services', 'Contact']} activeTab="Services" />                }
                </div>
                <Outlet />
              </div>
            </>
          );
        }