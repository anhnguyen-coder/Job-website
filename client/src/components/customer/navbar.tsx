import appLogo from "@/assets/images/logo.png";
import { CUSTOMER_APP_THEME } from "@/constant/constant";
import { NavItem } from "./navItem";
import { useCustomerAuth } from "@/contexts/customer";

interface NavItemData {
  id: number;
  title: string;
  icon: string;
  path: string;
}

const navItemData: NavItemData[] = [
  {
    id: 1,
    title: "Dashboard",
    icon: "mdi mdi-view-dashboard-outline",
    path: "/customer/dashboard",
  },
  {
    id: 2,
    title: "Jobs",
    icon: "mdi mdi-briefcase-outline",
    path: "/customer/jobs",
  },
  {
    id: 3,
    title: "Post new job",
    icon: "mdi mdi-plus",
    path: "/customer/create-job",
  },
  {
    id: 4,
    title: "Reviews",
    icon: "mdi mdi-star-outline",
    path: "/customer/reviews",
  },
  {
    id: 5,
    title: "Account history & Insights",
    icon: "mdi mdi-chart-bar",
    path: "/customer/history",
  },
];

export function Navbar() {
  const { signOut } = useCustomerAuth();

  return (
    <aside
      className="h-screen w-full flex flex-col justify-between py-6 px-4 shadow-xl"
      style={{ backgroundColor: CUSTOMER_APP_THEME.PRIMARI_COLOR }}
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-3 px-2">
        <img
          src={appLogo}
          alt="Job Ting Ting logo"
          className="w-14 h-14 rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
        />
        <div>
          <h3 className="text-2xl font-bold text-white leading-tight">
            Job Ting Ting
          </h3>
          <p className="text-xs text-emerald-100">Job management</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 mt-10 border-t border-b border-emerald-400/20 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/40">
        {navItemData.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.title}
            href={item.path}
          />
        ))}
      </nav>

      {/* Sign out */}
      <div className="pt-4 border-t border-emerald-400/20">
        <NavItem
          icon="mdi mdi-logout"
          label="Sign Out"
          isSignout
          onClickSignOut={signOut}
        />
      </div>
    </aside>
  );
}
