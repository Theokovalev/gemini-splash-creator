
import React from 'react';
import Logo from './Logo';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="border-b px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo />
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" className="text-sm">Editor</Button>
          <Button variant="ghost" className="text-sm">Billing</Button>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">user@example.com</span>
          </div>
          <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 1C6.47174 1 5.48651 1.36875 4.75736 2.02513C4.02821 2.6815 3.5 3.61835 3.5 4.66667C3.5 5.71498 4.02821 6.65183 4.75736 7.3082C5.48651 7.96458 6.47174 8.33333 7.5 8.33333C8.52826 8.33333 9.51349 7.96458 10.2426 7.3082C10.9718 6.65183 11.5 5.71498 11.5 4.66667C11.5 3.61835 10.9718 2.6815 10.2426 2.02513C9.51349 1.36875 8.52826 1 7.5 1Z" fill="currentColor"/>
              <path d="M7.5 10C4.6 10 1 11.575 1 14V15H14V14C14 11.575 10.4 10 7.5 10Z" fill="currentColor"/>
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
