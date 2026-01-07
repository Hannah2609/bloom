import { ThemeToggle } from "../../theme/ThemeToggle";
import { SidebarTrigger } from "../../ui/sidebar";

const Header = () => {
  return (
    <header className="flex justify-between p-8">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
};

export default Header;
