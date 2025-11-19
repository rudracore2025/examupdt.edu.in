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
import { adminResultsApi, ExamResult } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function ResultForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ExamResult>>({
    title: '',
    exam_type: 'B.Tech',
    semester: '',
    year: new Date().getFullYear(),
    link: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchResult();
    }
  }, [id]);

  const fetchResult = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const result = await adminResultsApi.getById(id);
      if (result) {
        setFormData(result);
      } else {
        toast.error('Result not found');
        navigate('/admin/results');
      }
    } catch (error) {
      console.error('Failed to fetch result:', error);
      toast.error('Failed to load result');
      navigate('/admin/results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.semester) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      const dataToSave = {
        ...formData,
        date: formData.date || new Date().toISOString(),
        views: formData.views || 0,
      };

      if (isEditMode && id) {
        await adminResultsApi.update(id, dataToSave);
        toast.success('Result updated successfully');
      } else {
        await adminResultsApi.create(dataToSave);
        toast.success('Result created successfully');
      }
      
      navigate('/admin/results');
    } catch (error) {
      console.error('Failed to save result:', error);
      toast.error('Failed to save result');
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/results')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-[#0A0A0A]">
              {isEditMode ? 'Edit Result' : 'Add New Result'}
            </h1>
            <p className="text-[#0A0A0A]/60">
              {isEditMode ? 'Update exam result details' : 'Create a new exam result'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., B.Tech 1st Year Results - May 2024"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Exam Type */}
          <div className="space-y-2">
            <Label htmlFor="examType">
              Exam Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.exam_type}
              onValueChange={(value: 'B.Tech' | 'M.Tech' | 'PharmD') =>
                setFormData({ ...formData, exam_type: value })
              }
            >
              <SelectTrigger id="examType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="M.Tech">M.Tech</SelectItem>
                <SelectItem value="PharmD">PharmD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Semester & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">
                Semester <span className="text-red-500">*</span>
              </Label>
              <Input
                id="semester"
                placeholder="e.g., 1st Semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="2024"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </div>
          </div>

          {/* Result Link */}
          <div className="space-y-2">
            <Label htmlFor="link">Result Link</Label>
            <Input
              id="link"
              type="url"
              placeholder="https://jntuh.ac.in/results/..."
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Released' | 'Pending' | 'Updated') =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Released">Released</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Updated">Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/results')}
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
              {isSaving ? 'Saving...' : isEditMode ? 'Update Result' : 'Create Result'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}