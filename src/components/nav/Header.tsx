import { ThemeToggle } from "../theme/ThemeToggle";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  return (
    <header className="flex justify-between p-3">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
};

export default Header;
