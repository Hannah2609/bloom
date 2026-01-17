import { ThemeToggle } from "../../theme/ThemeToggle";
import { SidebarTrigger } from "../../ui/sidebar";

const Header = () => {
  return (
    <header className="flex justify-between px-4 md:px-6 pt-8">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
};

export default Header;
