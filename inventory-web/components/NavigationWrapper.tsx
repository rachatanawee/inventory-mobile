/**
 * NavigationWrapper Component
 * Wraps page content with NavigationBar and NavigationMenu
 * Requirements: 1.6
 */

'use client';

import { useNavigation } from './NavigationProvider';
import NavigationBar from './NavigationBar';
import NavigationMenu from './NavigationMenu';
import NavigationLink from './NavigationLink';
import { navigationItems } from '@/lib/navigationConfig';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  const { isMenuOpen, openMenu, closeMenu, toggleMenu } = useNavigation();

  return (
    <>
      <NavigationBar onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <NavigationMenu isOpen={isMenuOpen} onClose={closeMenu} onOpen={openMenu}>
        <div className="pt-4">
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.id}
              href={item.href}
              label={item.label}
              icon={item.icon}
              onClick={closeMenu}
            />
          ))}
        </div>
      </NavigationMenu>
      {/* Add top padding to account for fixed NavigationBar */}
      <div className="pt-14">
        {children}
      </div>
    </>
  );
}
