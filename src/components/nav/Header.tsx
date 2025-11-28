import { ModeToggle } from '../theme/ModeToggle';
import { SidebarTrigger } from '../ui/sidebar';

const Header = () => {
  return (
    <header className="flex justify-between py-6 px-3">
      <SidebarTrigger />
      <ModeToggle />
    </header>
  );
};

export default Header;
