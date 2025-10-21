import appLogo from "@/assets/images/logo.png";
import { CUSTOMER_APP_THEME } from "@/constant/constant";
import { NavItem } from "./navItem";
import { useCustomerAuth } from "@/contexts/customer";

interface navItem {
  id: number;
  title: string;
  icon: string;
  path: string;
}

const navItemData: navItem[] = [
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
  const customerAuth = useCustomerAuth();
  return (
    <div
      className="h-screen w-full p-4 flex flex-col justify-between"
      style={{ backgroundColor: CUSTOMER_APP_THEME.PRIMARI_COLOR }}
    >
      {/* logo & title */}
      <div className="mt-4">
        <div className="flex items-center border-emerald-500">
          <div className="w-14 h-14">
            <img
              src={appLogo}
              alt="logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="text-gray-200 ml-3">
            <h3 className="text-2xl mb-2 font-bold">Job Ting Ting</h3>
            <p className="text-sm text-gray-300">Job management</p>
          </div>
        </div>
      </div>

      {/* items */}
      <div className="border-t-1 border-b-1 border-emerald-500/30 h-[100%] mt-10 py-4">
        {navItemData.map((item: navItem) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.title}
            href={item.path}
          />
        ))}
      </div>

      {/* signout */}
      <div className="p-4 border-t border-emerald-500/30">
        <button
          onClick={customerAuth.signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-500/20 transition-colors text-emerald-50"
        >
          <NavItem icon="mdi mdi-logout" label="Sign Out" />
        </button>
      </div>
    </div>
  );
}
