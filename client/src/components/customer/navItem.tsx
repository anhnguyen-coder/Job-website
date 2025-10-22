import { Link } from "react-router-dom";

interface NavItemProps {
  icon: string;
  label: string;
  href?: string;
  active?: boolean;
  isSignout?: boolean;
  onClickSignOut?: () => void;
}

export function NavItem({
  icon,
  label,
  href,
  active = false,
  isSignout,
  onClickSignOut,
}: NavItemProps) {
  const className = `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
    active ? "bg-white/20 text-white" : "text-emerald-100 hover:bg-white/10"
  }`;

  const handleSignOut = () => {
    if (isSignout && onClickSignOut) {
      onClickSignOut();
    }
  };

  if (href) {
    return (
      <Link to={href} className={className}>
        <i className={icon}></i>
        <span className="font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <button className={className} onClick={handleSignOut}>
      <i className={icon}></i>
      <span className="font-medium">{label}</span>
    </button>
  );
}
