
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Taskify</h1>
        <p className="text-xl text-gray-400 mb-8">Simple task management for teams</p>
        <div className="space-x-4">
          <Button asChild className="bg-[#4ea8de] hover:bg-[#3a8bc4] text-white">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
