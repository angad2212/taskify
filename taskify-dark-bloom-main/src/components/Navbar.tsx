import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#1e1e1e] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/dashboard" className="text-2xl font-bold text-white">
          Taskify
        </Link>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">
            {user?.name} ({user?.role})
          </span>
          
          {user?.role === 'admin' && (
            <Button 
              asChild 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Link to="/analytics">Analytics</Link>
            </Button>
          )}

          {/* Ask TaskGPT button */}
          <Button
            className="bg-purple-600 hover:bg-purple-700 rounded-md text-sm px-3 py-1 text-white"
          >
            Ask TaskGPT
          </Button>
          
          <Button 
            onClick={logout}
            className="bg-purple-600 hover:bg-purple-700 text-white border-0"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
