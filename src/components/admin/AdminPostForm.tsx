import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Trash2, Plus, X } from 'lucide-react';
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
import { Badge } from '../ui/badge';
import { adminPostsApi, AdminPost } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

const categories = [
  'Notifications',
  'Exams',
  'Results',
  'Events',
  'Classes',
  'Academic',
];

export function AdminPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminPost>>({
    title: '',
    content: '',
    category: 'Exams',
    tags: [],
    status: 'draft',
    attachments: [],
    youtube_links: [],
    trending: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const post = await adminPostsApi.getById(id);
      if (post) {
        setFormData(post);
      } else {
        toast.error('Post not found');
        navigate('/admin/notifications');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      toast.error('Failed to load post');
      navigate('/admin/notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      const postData = { ...formData, status };

      if (isEditMode && id) {
        await adminPostsApi.update(id, postData);
        toast.success('Post updated successfully');
      } else {
        await adminPostsApi.create(postData);
        toast.success('Post created successfully');
      }

      navigate('/admin/notifications');
    } catch (error) {
      console.error('Failed to save post:', error);
      toast.error('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleAddYouTubeLink = () => {
    if (youtubeInput.trim()) {
      // Extract video ID from YouTube URL
      let videoId = youtubeInput.trim();
      const match = youtubeInput.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (match) {
        videoId = match[1];
      }

      if (!formData.youtube_links?.includes(videoId)) {
        setFormData({
          ...formData,
          youtube_links: [...(formData.youtube_links || []), videoId],
        });
        setYoutubeInput('');
      }
    }
  };

  const removeYoutubeLink = (link: string) => {
    setFormData({
      ...formData,
      youtube_links: formData.youtube_links?.filter((l) => l !== link) || [],
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#004AAD] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#0A0A0A]/60">Loading post...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/notifications')}
            className="mb-3 sm:mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
          <h1 className="text-[#0A0A0A] text-2xl sm:text-3xl mb-1">
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-[#0A0A0A]/60 text-sm sm:text-base">
            {isEditMode ? 'Update your post details' : 'Fill in the details to create a new post'}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4 sm:space-y-6">
          {/* Title & Category */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1.5 text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-sm">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-1.5 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-sm">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content" className="text-sm">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Enter post content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                required
                className="mt-1.5 text-sm"
              />
              <p className="text-xs text-[#0A0A0A]/40 mt-2">
                You can use HTML formatting in the content
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-4">
            <div>
              <Label htmlFor="tags" className="text-sm">Tags</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="tags"
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="text-sm"
                />
                <Button type="button" onClick={handleAddTag} variant="outline" className="flex-shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-3 pr-1 text-xs">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* YouTube Links */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-4">
            <div>
              <Label htmlFor="youtube" className="text-sm">YouTube Video Links</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="youtube"
                  placeholder="Enter YouTube URL or Video ID"
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddYouTubeLink())
                  }
                  className="text-sm"
                />
                <Button type="button" onClick={handleAddYouTubeLink} variant="outline" className="flex-shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {formData.youtube_links && formData.youtube_links.length > 0 && (
              <div className="space-y-2">
                {formData.youtube_links.map((link) => (
                  <div
                    key={link}
                    className="flex items-center justify-between gap-3 p-3 bg-[#F5F5F5] rounded-lg"
                  >
                    <span className="text-sm text-[#0A0A0A] truncate flex-1">{link}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeYoutubeLink(link)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trending"
                checked={formData.trending || false}
                onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                className="w-4 h-4 text-[#004AAD] rounded flex-shrink-0"
              />
              <Label htmlFor="trending" className="cursor-pointer text-sm">
                Mark as trending
              </Label>
            </div>
          </div>

          {/* Actions - Improved mobile layout */}
          <div className="flex flex-col gap-3 sticky bottom-0 bg-[#F5F5F5] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto w-full">
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                variant="outline"
                disabled={isSaving}
                className="flex-1 h-11 sm:h-10"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={isSaving}
                className="flex-1 bg-[#004AAD] h-11 sm:h-10"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}