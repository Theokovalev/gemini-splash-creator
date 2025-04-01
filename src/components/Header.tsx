
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { UserProfile } from '@/components/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AuthDialog from '@/components/AuthDialog';
import { Home, Edit, CreditCard } from 'lucide-react';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false);

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Logo />
          
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/editor"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Editor</span>
              </Link>
              <Link 
                to="#"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserProfile />
          ) : (
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsAuthDialogOpen(true)}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
      
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
      />
    </header>
  );
};

export default Header;
