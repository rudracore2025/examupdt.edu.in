import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { adminNotesApi, Note } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Note>>({
    title: '',
    subject: '',
    topic: '',
    file_url: '',
    file_size: 0,
    file_type: 'PDF',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const note = await adminNotesApi.getById(id);
      if (note) {
        setFormData(note);
      } else {
        toast.error('Note not found');
        navigate('/admin/notes');
      }
    } catch (error) {
      console.error('Failed to fetch note:', error);
      toast.error('Failed to load note');
      navigate('/admin/notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.file_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      const dataToSave = {
        ...formData,
        uploadDate: formData.uploadDate || new Date().toISOString(),
        downloads: formData.downloads || 0,
      };

      if (isEditMode && id) {
        await adminNotesApi.update(id, dataToSave);
        toast.success('Note updated successfully');
      } else {
        await adminNotesApi.create(dataToSave);
        toast.success('Note created successfully');
      }
      
      navigate('/admin/notes');
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
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
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/notes')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-[#0A0A0A]">
              {isEditMode ? 'Edit Note' : 'Add New Note'}
            </h1>
            <p className="text-[#0A0A0A]/60">
              {isEditMode ? 'Update note details' : 'Create a new note'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="e.g., Data Structures"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Binary Trees"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Complete Notes on Binary Trees"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUrl">
              File URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fileUrl"
              type="url"
              placeholder="https://..."
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileType">File Type</Label>
            <Select
              value={formData.file_type}
              onValueChange={(value: 'PDF' | 'DOC' | 'PPT' | 'ZIP') =>
                setFormData({ ...formData, file_type: value })
              }
            >
              <SelectTrigger id="fileType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="DOC">DOC</SelectItem>
                <SelectItem value="PPT">PPT</SelectItem>
                <SelectItem value="ZIP">ZIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/notes')}
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
              {isSaving ? 'Saving...' : isEditMode ? 'Update Note' : 'Create Note'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}