/**
 * NavigationMenu Component
 * Slide-in navigation menu with overlay, scroll lock, and touch gesture support
 * Requirements: 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 5.2, 6.4, 6.5
 */

'use client';

import { useEffect, useRef } from 'react';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
}

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
}

export default function NavigationMenu({ isOpen, onClose, onOpen, children }: NavigationMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const savedScrollPositionRef = useRef<number>(0);
  const touchStateRef = useRef<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
  });

  // Body scroll lock when menu is open with scroll position tracking
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position to ref (handles rapid toggling)
      savedScrollPositionRef.current = window.scrollY;
      
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position from ref
        window.scrollTo(0, savedScrollPositionRef.current);
      };
    }
  }, [isOpen]);

  // Touch gesture handlers for swipe to close (when menu is open)
  useEffect(() => {
    if (!isOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        isDragging: true,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStateRef.current.isDragging) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStateRef.current.startX;
      const deltaY = Math.abs(touch.clientY - touchStateRef.current.startY);

      // Only handle horizontal swipes (prevent conflict with vertical scrolling)
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
        e.preventDefault();
        touchStateRef.current.currentX = touch.clientX;
      }
    };

    const handleTouchEnd = () => {
      if (!touchStateRef.current.isDragging) return;

      const deltaX = touchStateRef.current.currentX - touchStateRef.current.startX;
      const threshold = -50; // Swipe left threshold

      // Close menu if swiped left beyond threshold
      if (deltaX < threshold) {
        onClose();
      }

      touchStateRef.current = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false,
      };
    };

    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      menuElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      menuElement.addEventListener('touchend', handleTouchEnd);

      return () => {
        menuElement.removeEventListener('touchstart', handleTouchStart);
        menuElement.removeEventListener('touchmove', handleTouchMove);
        menuElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isOpen, onClose]);

  // Touch gesture handler for swipe from left edge to open (when menu is closed)
  useEffect(() => {
    if (isOpen) return;

    const handleEdgeTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const edgeZone = 20; // Left edge detection zone in pixels

      // Only trigger if touch starts from left edge
      if (touch.clientX <= edgeZone) {
        touchStateRef.current = {
          startX: touch.clientX,
          startY: touch.clientY,
          currentX: touch.clientX,
          currentY: touch.clientY,
          isDragging: true,
        };
      }
    };

    const handleEdgeTouchMove = (e: TouchEvent) => {
      if (!touchStateRef.current.isDragging) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStateRef.current.startX;
      const deltaY = Math.abs(touch.clientY - touchStateRef.current.startY);

      // Only handle horizontal swipes (prevent conflict with vertical scrolling)
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
        e.preventDefault();
        touchStateRef.current.currentX = touch.clientX;
      }
    };

    const handleEdgeTouchEnd = () => {
      if (!touchStateRef.current.isDragging) return;

      const deltaX = touchStateRef.current.currentX - touchStateRef.current.startX;
      const threshold = 50; // Swipe right threshold

      // Open menu if swiped right beyond threshold from left edge
      if (deltaX > threshold && touchStateRef.current.startX <= 20) {
        onOpen();
      }

      touchStateRef.current = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false,
      };
    };

    document.addEventListener('touchstart', handleEdgeTouchStart, { passive: false });
    document.addEventListener('touchmove', handleEdgeTouchMove, { passive: false });
    document.addEventListener('touchend', handleEdgeTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleEdgeTouchStart);
      document.removeEventListener('touchmove', handleEdgeTouchMove);
      document.removeEventListener('touchend', handleEdgeTouchEnd);
    };
  }, [isOpen, onOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the overlay itself, not the menu panel
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
      >
        {/* Menu Panel */}
        <div
          ref={menuRef}
          className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
}
