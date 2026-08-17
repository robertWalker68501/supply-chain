import { auth } from '@/lib/auth';
import SiteLogo from '../SiteLogo';
import ThemeToggle from '../ui/theme-toggle';
import MobileMenu from './MobileMenu';
import { headers } from 'next/headers';
import AuthButtons from '../auth/AuthButtons';
import { redirect } from 'next/navigation';

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) return redirect('/dashboard');

  return (
    <nav className='flex items-center justify-between'>
      {/* Site logo */}
      <SiteLogo href='/' />

      {/* Desktop nav */}
      <div className='hidden items-center gap-4 md:flex'>
        <AuthButtons />
        <ThemeToggle />
      </div>

      {/* Mobile nav */}
      <div className='block md:hidden'>
        <MobileMenu />
      </div>
    </nav>
  );
};

export default Navbar;
