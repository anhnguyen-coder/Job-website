import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

export interface NavItemInterface {
  icon: React.ReactNode;
  label: string;
  href?: string;
  childrenItems?: { title: string; path: string }[];
  isSignout?: boolean;
  onClickSignOut?: () => void;
}

export function NavItem({
  icon,
  label,
  href,
  childrenItems,
  isSignout,
  onClickSignOut,
}: NavItemInterface) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const active = href && location.pathname === href;
  const isParentActive =
    childrenItems?.some((child) => location.pathname === child.path) ?? false;

  const base =
    "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer mb-1";
  const activeClass = "bg-sky-100 text-sky-700 font-semibold";
  const inactiveClass = "text-slate-600 hover:bg-slate-100 hover:text-sky-700";

  const handleClick = () => {
    if (isSignout && onClickSignOut) return onClickSignOut();
    if (childrenItems) return setOpen((prev) => !prev);
  };

  const className = `${base} ${
    active || isParentActive ? activeClass : inactiveClass
  }`;

  return (
    <div className="flex flex-col">
      {/* Main item */}
      {href ? (
        <Link
          to={href}
          className={className}
          style={{ textDecoration: "none" }}
        >
          <div className="flex items-center gap-3">
            <span className="w-5 flex justify-center text-sky-600">{icon}</span>
            <span>{label}</span>
          </div>
        </Link>
      ) : (
        <button onClick={handleClick} className={className}>
          <div className="flex items-center gap-3">
            <span className="w-5 flex justify-center text-sky-600">{icon}</span>
            <span>{label}</span>
          </div>
          {childrenItems && (
            <span>
              {open ? (
                <ChevronUp size={16} className="text-sky-600" />
              ) : (
                <ChevronDown size={16} className="text-sky-600" />
              )}
            </span>
          )}
        </button>
      )}

      {/* Submenu */}
      {open && childrenItems && (
        <div className="flex flex-col mt-1 ml-3 border-l border-slate-200 pl-3 gap-1">
          {childrenItems.map((child) => {
            const childActive = location.pathname === child.path;
            return (
              <Link
                style={{ textDecoration: "none" }}
                key={child.path}
                to={child.path}
                className={`text-sm py-2 px-3 rounded-md transition-all ${
                  childActive
                    ? "bg-sky-100 text-sky-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-sky-700"
                }`}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
