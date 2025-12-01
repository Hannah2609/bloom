import { ThemeToggle } from '../theme/ThemeToggle';
import { SidebarTrigger } from '../ui/sidebar';

const Header = () => {
  return (
    <header className="flex justify-between py-6 px-3">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
};

export default Header;
