import { ThemeToggle } from "../../theme/ThemeToggle";
import { SidebarTrigger } from "../../ui/sidebar";

const Header = () => {
  return (
    <header className="sticky max-w-7xl mx-auto top-4 z-50 flex items-center justify-between px-4 md:pr-6 md:pl-4">
      <div className="bg-card/80 dark:bg-muted/80 backdrop-blur-lg p-2 rounded-full shadow-sm">
        <SidebarTrigger />
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Header;
