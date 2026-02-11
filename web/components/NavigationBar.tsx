/**
 * NavigationBar Component
 * Displays hamburger menu icon and application title
 * Requirements: 1.1, 4.5, 6.1
 */

'use client';

interface NavigationBarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function NavigationBar({ onMenuToggle, isMenuOpen }: NavigationBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-[#3282B8] z-40 shadow-md">
      <div className="h-full flex items-center px-3">
        {/* Hamburger Icon Button */}
        <button
          onClick={onMenuToggle}
          className="w-11 h-11 flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
          aria-label={isMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={isMenuOpen}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center relative">
            {/* Top line */}
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out absolute ${
                isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
              }`}
            />
            {/* Middle line */}
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* Bottom line */}
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out absolute ${
                isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
              }`}
            />
          </div>
        </button>

        {/* Application Title */}
        <h1 className="ml-3 text-lg font-semibold text-white">
          Inventory System
        </h1>
      </div>
    </nav>
  );
}
