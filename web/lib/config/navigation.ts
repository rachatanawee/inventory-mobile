/**
 * Navigation Configuration
 * 
 * Defines the navigation items for the hamburger menu.
 * Requirements: 2.1, 2.2
 */

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string; // Emoji or icon identifier
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'หน้าหลัก',
    href: '/',
    icon: '🏠'
  },
  {
    id: 'about',
    label: 'เกี่ยวกับ',
    href: '/about',
    icon: 'ℹ️'
  }
];
