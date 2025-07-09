
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    console.log('ProtectedRoute: Loading auth state...');
    return <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  console.log('ProtectedRoute: User authenticated, rendering children');

  return <>{children}</>;
};

export default ProtectedRoute;
