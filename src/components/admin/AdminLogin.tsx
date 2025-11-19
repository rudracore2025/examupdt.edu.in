import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { auth } from '../../utils/auth';
import logo from 'figma:asset/1cd64d29c347abbc26d8fefe3e909a4610fd103b.png';

export function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await auth.signIn(formData.email, formData.password);
      
      if (result) {
        toast.success('Welcome back!', {
          description: 'Successfully logged in to admin panel.',
        });
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if error is due to account not existing
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Admin account not found', {
          description: 'Please create your admin account first using the Supabase dashboard.',
          duration: 5000,
        });
      } else {
        toast.error('Login failed', {
          description: error.message || 'Invalid email or password.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to User Panel Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to User Panel
          </Button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src={logo} alt="Examupdt Logo" className="h-16 w-16 object-contain" />
            <div className="text-left">
              <h1 className="text-[#0A0A0A]">Examupdt</h1>
              <p className="text-[#0A0A0A]/60 text-sm">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-lg">
          <h2 className="text-[#0A0A0A] mb-6 text-center">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="examupdts@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#004AAD]"
              size="lg"
              disabled={isLoading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-[#0A0A0A]/40 text-xs mt-6 text-center">
            Protected area. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}