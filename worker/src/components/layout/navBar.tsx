import { NavItem } from "@/components/base/navItem";
import {
  Package,
  LogOut,
  BookMarked,
  LayoutDashboard,
} from "lucide-react";
import type { ReactNode } from "react";
import logoImg from "@/assets/logo.png";
import { useWorkerAuth } from "@/context/context";

interface NavItemType {
  id: number;
  title: string;
  icon: ReactNode;
  path?: string;
  children?: { title: string; path: string }[];
}

const navItemData: NavItemType[] = [
  {
    id: 1,
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
  },
  {
    id: 2,
    title: "Find new job",
    icon: <Package size={20} />,
    path: "/jobs",
  },
  {
    id: 3,
    title: "Bookmarked",
    icon: <BookMarked size={20} />,
    path: "/bookmarked",
  },
];

export function Navbar() {
  const auth = useWorkerAuth();

  return (
    <div className="flex flex-col justify-between h-full p-3 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <img src={logoImg} alt="" className="w-[50px] h-[50px] rounded-full" />
        <div>
          <p className="text-2xl font-semibold text-sky-700 m-0">
            Job TingTing
          </p>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto border-t border-slate-200 pt-4">
        {navItemData.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.title}
            href={item.path}
            childrenItems={item.children}
          />
        ))}
      </nav>

      {/* Sign out */}
      <div className="mt-6 border-t border-slate-200 pt-4 shrink-0">
        <NavItem
          icon={<LogOut size={20} />}
          label="Sign out"
          isSignout
          onClickSignOut={auth.signOut}
        />
      </div>
    </div>
  );
}
