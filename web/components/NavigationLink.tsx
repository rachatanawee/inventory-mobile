/**
 * NavigationLink Component
 * Individual navigation link with icon, label, and active state styling
 * Requirements: 2.1, 2.2, 2.3, 2.5
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationLinkProps {
  href: string;
  label: string;
  icon?: string;
  onClick: () => void;
}

export default function NavigationLink({ href, label, icon, onClick }: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick();
    // Let the browser handle navigation naturally
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`
        flex items-center gap-3 px-6 py-4 text-base font-medium
        transition-colors duration-200
        border-l-4
        ${
          isActive
            ? 'bg-[#BBE1FA] text-[#0F4C75] border-[#3282B8]'
            : 'bg-white text-[#1B262C] border-transparent hover:bg-[#F0F8FF]'
        }
      `}
    >
      {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </a>
  );
}
