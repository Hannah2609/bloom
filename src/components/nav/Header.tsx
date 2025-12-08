import { ThemeToggle } from "../theme/ThemeToggle";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  return (
    <header className="flex justify-between px-3 py-6">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
};

export default Header;
