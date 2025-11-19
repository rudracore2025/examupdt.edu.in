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
import { adminQuestionsApi, Question } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function QuestionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Question>>({
    title: '',
    subject: 'Data Structures',
    topic: '',
    difficulty: 'Medium',
    content: '',
    image_url: '',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchQuestion();
    }
  }, [id]);

  const fetchQuestion = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const question = await adminQuestionsApi.getById(id);
      if (question) {
        setFormData(question);
      } else {
        toast.error('Question not found');
        navigate('/admin/questions');
      }
    } catch (error) {
      console.error('Failed to fetch question:', error);
      toast.error('Failed to load question');
      navigate('/admin/questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.topic || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      const dataToSave = {
        ...formData,
        created_at: formData.created_at || new Date().toISOString(),
      };

      if (isEditMode && id) {
        await adminQuestionsApi.update(id, dataToSave);
        toast.success('Question updated successfully');
      } else {
        await adminQuestionsApi.create(dataToSave);
        toast.success('Question created successfully');
      }
      
      navigate('/admin/questions');
    } catch (error) {
      console.error('Failed to save question:', error);
      toast.error('Failed to save question');
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/questions')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-[#0A0A0A]">
              {isEditMode ? 'Edit Question' : 'Add New Question'}
            </h1>
            <p className="text-[#0A0A0A]/60">
              {isEditMode ? 'Update question details' : 'Create a new important question'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-6">
          {/* Question Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Question Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Explain Binary Search Tree implementation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Subject & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData({ ...formData, subject: value })
                }
              >
                <SelectTrigger id="subject">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Data Structures">Data Structures</SelectItem>
                  <SelectItem value="Algorithms">Algorithms</SelectItem>
                  <SelectItem value="Database Management">Database Management</SelectItem>
                  <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                  <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                  <SelectItem value="Web Technologies">Web Technologies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">
                Topic <span className="text-red-500">*</span>
              </Label>
              <Input
                id="topic"
                placeholder="e.g., Trees, Sorting, etc."
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">
              Difficulty <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value: 'Easy' | 'Medium' | 'Hard') =>
                setFormData({ ...formData, difficulty: value })
              }
            >
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Question Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Write the full question here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="resize-none"
              required
            />
            <p className="text-[#0A0A0A]/40">Write the complete question with all details</p>
          </div>

          {/* Optional Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Question image preview" 
                  className="w-full max-w-md h-auto rounded border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-[#0A0A0A]/40">Add an image URL if the question includes a diagram or illustration</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/questions')}
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
              {isSaving ? 'Saving...' : isEditMode ? 'Update Question' : 'Create Question'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}