import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { adminInternshipsApi, Internship } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function InternshipForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Internship>>({
    title: '',
    company: '',
    stipend: '',
    duration: '',
    location: '',
    mode: 'Remote',
    apply_link: '',
    description: '',
    status: 'Active',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchInternship();
    }
  }, [id]);

  const fetchInternship = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const internship = await adminInternshipsApi.getById(id);
      if (internship) {
        setFormData(internship);
      } else {
        toast.error('Internship not found');
        navigate('/admin/internships');
      }
    } catch (error) {
      console.error('Failed to fetch internship:', error);
      toast.error('Failed to load internship');
      navigate('/admin/internships');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.duration) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      const dataToSave = {
        ...formData,
        posted_date: formData.posted_date || new Date().toISOString(),
        applicants: formData.applicants || 0,
      };

      if (isEditMode && id) {
        await adminInternshipsApi.update(id, dataToSave);
        toast.success('Internship updated successfully');
      } else {
        await adminInternshipsApi.create(dataToSave);
        toast.success('Internship created successfully');
      }
      
      navigate('/admin/internships');
    } catch (error) {
      console.error('Failed to save internship:', error);
      toast.error('Failed to save internship');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gray-200 h-8 w-48 rounded animate-pulse"></div>
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="bg-gray-200 h-10 w-full rounded animate-pulse"></div>
            <div className="bg-gray-200 h-10 w-full rounded animate-pulse"></div>
            <div className="bg-gray-200 h-32 w-full rounded animate-pulse"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/internships')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-[#0A0A0A]">
              {isEditMode ? 'Edit Internship' : 'Add New Internship'}
            </h1>
            <p className="text-[#0A0A0A]/60">
              {isEditMode ? 'Update internship details' : 'Create a new internship'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-6">
          {/* Internship Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Internship Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Full Stack Development Intern"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company"
              placeholder="e.g., Microsoft"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>

          {/* Stipend & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stipend">Stipend</Label>
              <Input
                id="stipend"
                placeholder="e.g., ₹10,000/month or Unpaid"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
              />
              <p className="text-[#0A0A0A]/40">Leave blank if unpaid</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duration <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duration"
                placeholder="e.g., 3 months or 6 weeks"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Location & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Bangalore, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mode">
                Internship Mode <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.mode}
                onValueChange={(value: 'Remote' | 'Hybrid' | 'Onsite') =>
                  setFormData({ ...formData, mode: value })
                }
              >
                <SelectTrigger id="mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Onsite">Onsite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Apply Link */}
          <div className="space-y-2">
            <Label htmlFor="apply_link">Apply Link</Label>
            <Input
              id="apply_link"
              type="url"
              placeholder="https://company.com/internships/apply"
              value={formData.apply_link}
              onChange={(e) => setFormData({ ...formData, apply_link: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the internship role, requirements, and learning opportunities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="resize-none"
            />
            <p className="text-[#0A0A0A]/40">Brief overview of the internship</p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Active' | 'Closed') =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/internships')}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-initial bg-[#004AAD]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : isEditMode ? 'Update Internship' : 'Create Internship'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}