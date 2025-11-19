import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Filter, X, Search, Video } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LoadingSkeleton } from './shared/LoadingSkeleton';
import { EmptyState } from './shared/EmptyState';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { adminYouTubeApi, YouTubeVideo } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function AdminYouTube() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [videos, filters]);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const data = await adminYouTubeApi.getAll();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...videos];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchLower) ||
          (video.description && video.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter((video) => video.category === filters.category);
    }

    if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.uploadedDate).getTime() - new Date(b.uploadedDate).getTime());
    }

    setFilteredVideos(filtered);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminYouTubeApi.delete(deleteId);
      setVideos(videos.filter((v) => v.id !== deleteId));
      toast.success('Video deleted successfully');
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete video:', error);
      toast.error('Failed to delete video');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsDeleting(true);
      await Promise.all(selectedIds.map((id) => adminYouTubeApi.delete(id)));
      setVideos(videos.filter((v) => !selectedIds.includes(v.id)));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} videos deleted successfully`);
    } catch (error) {
      console.error('Failed to delete videos:', error);
      toast.error('Failed to delete videos');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVideos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVideos.map((v) => v.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = filters.search || filters.category !== 'all';

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
          <div className="space-y-1">
            <div className="bg-gray-200 h-8 w-48 rounded animate-pulse"></div>
            <div className="bg-gray-200 h-5 w-64 rounded animate-pulse"></div>
          </div>
          <LoadingSkeleton rows={8} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h1 className="text-[#0A0A0A]">YouTube Links</h1>
            <p className="text-[#0A0A0A]/60">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
              {hasActiveFilters && ' (filtered)'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-[#004AAD] flex-1 sm:flex-initial">
              <Link to="/admin/youtube/create">
                <Plus className="w-4 h-4 mr-2" />
                Add New Video
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 sm:flex-initial"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters {hasActiveFilters && `(${Object.values(filters).filter(v => v && v !== 'all' && v !== 'newest').length})`}
            </Button>
            {selectedIds.length > 0 && (
              <Button
                variant="outline"
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex-1 sm:flex-initial text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0A0A0A]">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-[#0A0A0A]/60 mb-1.5 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/40" />
                  <Input
                    placeholder="Search videos..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#0A0A0A]/60 mb-1.5 block">Category</label>
                <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Lecture">Lecture</SelectItem>
                    <SelectItem value="Exam Preparation">Exam Preparation</SelectItem>
                    <SelectItem value="Tips & Tricks">Tips & Tricks</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[#0A0A0A]/60 mb-1.5 block">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(v) => setFilters({ ...filters, sortBy: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Videos List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredVideos.length && filteredVideos.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-[#004AAD] rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Thumbnail</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Views</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVideos.length > 0 ? (
                  filteredVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-[#F5F5F5] transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(video.id)}
                          onChange={() => toggleSelect(video.id)}
                          className="w-4 h-4 text-[#004AAD] rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {video.thumbnailUrl ? (
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="w-20 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Video className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-md truncate">{video.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                          {video.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[#0A0A0A]/60">{video.views || 0}</td>
                      <td className="px-4 py-3 text-[#0A0A0A]/60">{formatDate(video.uploadedDate)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/admin/youtube/edit/${video.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(video.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        icon={Video}
                        title="No videos found"
                        description={hasActiveFilters ? 'Try adjusting your filters' : 'Add your first YouTube video to get started'}
                        actionLabel={!hasActiveFilters ? 'Add Video' : undefined}
                        onAction={!hasActiveFilters ? () => navigate('/admin/youtube/create') : undefined}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <div key={video.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(video.id)}
                      onChange={() => toggleSelect(video.id)}
                      className="w-4 h-4 text-[#004AAD] rounded mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center mb-3">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <h3 className="text-[#0A0A0A] mb-2 line-clamp-2">{video.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                          {video.category}
                        </Badge>
                        <span className="text-[#0A0A0A]/60">{video.views || 0} views</span>
                      </div>
                      <p className="text-[#0A0A0A]/60 mb-3">{formatDate(video.uploadedDate)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/admin/youtube/edit/${video.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(video.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Video}
                title="No videos found"
                description={hasActiveFilters ? 'Try adjusting your filters' : 'Add your first YouTube video to get started'}
                actionLabel={!hasActiveFilters ? 'Add Video' : undefined}
                onAction={!hasActiveFilters ? () => navigate('/admin/youtube/create') : undefined}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the video.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
