import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
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
import { adminJobsApi, Job } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    company: '',
    company_logo: '',
    location: '',
    job_mode: 'Remote',
    salary: '',
    apply_link: '',
    description: '',
    status: 'Active',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const job = await adminJobsApi.getById(id);
      if (job) {
        setFormData(job);
      } else {
        toast.error('Job not found');
        navigate('/admin/jobs');
      }
    } catch (error) {
      console.error('Failed to fetch job:', error);
      toast.error('Failed to load job');
      navigate('/admin/jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.location) {
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
        await adminJobsApi.update(id, dataToSave);
        toast.success('Job updated successfully');
      } else {
        await adminJobsApi.create(dataToSave);
        toast.success('Job created successfully');
      }
      
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Failed to save job:', error);
      toast.error('Failed to save job');
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/jobs')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-[#0A0A0A]">
              {isEditMode ? 'Edit Job' : 'Add New Job'}
            </h1>
            <p className="text-[#0A0A0A]/60">
              {isEditMode ? 'Update job posting details' : 'Create a new job posting'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Job Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Frontend Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Company Name & Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                placeholder="e.g., Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyLogo">Company Logo URL</Label>
              <div className="flex gap-2">
                <Input
                  id="companyLogo"
                  type="url"
                  placeholder="https://..."
                  value={formData.company_logo}
                  onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
                />
                {formData.company_logo && (
                  <div className="w-10 h-10 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                    <img src={formData.company_logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-[#0A0A0A]/40">Optional: Add company logo URL</p>
            </div>
          </div>

          {/* Location & Job Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                placeholder="e.g., Hyderabad, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobMode">
                Job Mode <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.job_mode}
                onValueChange={(value: 'Remote' | 'Hybrid' | 'Onsite') =>
                  setFormData({ ...formData, job_mode: value })
                }
              >
                <SelectTrigger id="jobMode">
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

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Salary (Optional)</Label>
            <Input
              id="salary"
              placeholder="e.g., ₹5-8 LPA or Not Disclosed"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>

          {/* Apply Link */}
          <div className="space-y-2">
            <Label htmlFor="applyLink">Apply Link</Label>
            <Input
              id="applyLink"
              type="url"
              placeholder="https://company.com/careers/apply"
              value={formData.apply_link}
              onChange={(e) => setFormData({ ...formData, apply_link: e.target.value })}
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the job role, requirements, and benefits..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="resize-none"
            />
            <p className="text-[#0A0A0A]/40">Brief overview of the job posting</p>
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
              onClick={() => navigate('/admin/jobs')}
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
              {isSaving ? 'Saving...' : isEditMode ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}