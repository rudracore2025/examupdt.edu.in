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
import { adminYouTubeApi, YouTubeVideo } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function YouTubeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<YouTubeVideo>>({
    title: '',
    video_link: '',
    description: '',
    thumbnail_url: '',
    embed_link: '',
    category: 'Tutorial',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchVideo();
    }
  }, [id]);

  const fetchVideo = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const video = await adminYouTubeApi.getById(id);
      if (video) {
        setFormData(video);
      } else {
        toast.error('Video not found');
        navigate('/admin/youtube');
      }
    } catch (error) {
      console.error('Failed to fetch video:', error);
      toast.error('Failed to load video');
      navigate('/admin/youtube');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.video_link) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      const dataToSave = {
        ...formData,
        uploadedDate: formData.uploadedDate || new Date().toISOString(),
        views: formData.views || 0,
      };

      if (isEditMode && id) {
        await adminYouTubeApi.update(id, dataToSave);
        toast.success('Video updated successfully');
      } else {
        await adminYouTubeApi.create(dataToSave);
        toast.success('Video created successfully');
      }
      
      navigate('/admin/youtube');
    } catch (error) {
      console.error('Failed to save video:', error);
      toast.error('Failed to save video');
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/youtube')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-[#0A0A0A]">
              {isEditMode ? 'Edit Video' : 'Add New Video'}
            </h1>
            <p className="text-[#0A0A0A]/60">
              {isEditMode ? 'Update video details' : 'Add a new YouTube video'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-6">
          {/* Video Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Video Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Complete DSA Tutorial for JNTUH Students"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* YouTube Video Link */}
          <div className="space-y-2">
            <Label htmlFor="videoLink">
              YouTube Video Link <span className="text-red-500">*</span>
            </Label>
            <Input
              id="videoLink"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.video_link}
              onChange={(e) => setFormData({ ...formData, video_link: e.target.value })}
              required
            />
            <p className="text-[#0A0A0A]/40">Enter the full YouTube video URL</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tutorial">Tutorial</SelectItem>
                <SelectItem value="Lecture">Lecture</SelectItem>
                <SelectItem value="Exam Preparation">Exam Preparation</SelectItem>
                <SelectItem value="Tips & Tricks">Tips & Tricks</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the video content..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
            <Input
              id="thumbnailUrl"
              type="url"
              placeholder="https://..."
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
            />
            {formData.thumbnail_url && (
              <div className="mt-2">
                <img 
                  src={formData.thumbnail_url} 
                  alt="Thumbnail preview" 
                  className="w-full max-w-sm h-40 object-cover rounded border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-[#0A0A0A]/40">Custom thumbnail image URL (optional)</p>
          </div>

          {/* Embed Link */}
          <div className="space-y-2">
            <Label htmlFor="embedLink">Embed Link (Optional)</Label>
            <Input
              id="embedLink"
              type="url"
              placeholder="https://www.youtube.com/embed/..."
              value={formData.embed_link}
              onChange={(e) => setFormData({ ...formData, embed_link: e.target.value })}
            />
            <p className="text-[#0A0A0A]/40">YouTube embed URL (optional, will be auto-generated if left blank)</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/youtube')}
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
              {isSaving ? 'Saving...' : isEditMode ? 'Update Video' : 'Create Video'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}