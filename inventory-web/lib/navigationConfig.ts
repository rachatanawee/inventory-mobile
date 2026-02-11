/**
 * Navigation Configuration
 * Defines navigation items for the application
 * Requirements: 2.1, 2.2
 */

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'หน้าหลัก',
    href: '/',
    icon: '🏠'
  },
  {
    id: 'download',
    label: 'ดาวน์โหลดแอป',
    href: '/download',
    icon: '📱'
  },
  {
    id: 'about',
    label: 'เกี่ยวกับ',
    href: '/about',
    icon: 'ℹ️'
  }
];
