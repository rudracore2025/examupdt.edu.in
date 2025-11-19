import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Filter, X, Calendar, Search } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { DataTable } from './DataTable';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { StatusBadge } from './shared/StatusBadge';
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
import { adminPostsApi, AdminPost } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function EnhancedNotifications() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<AdminPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [posts, filters]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await adminPostsApi.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...posts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter((post) => post.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((post) => post.status === filters.status);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredPosts(filtered);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminPostsApi.delete(deleteId);
      setPosts(posts.filter((p) => p.id !== deleteId));
      toast.success('Post deleted successfully');
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsDeleting(true);
      await Promise.all(selectedIds.map((id) => adminPostsApi.delete(id)));
      setPosts(posts.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} posts deleted successfully`);
    } catch (error) {
      console.error('Failed to delete posts:', error);
      toast.error('Failed to delete posts');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPosts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPosts.map((p) => p.id));
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

  const categories = Array.from(new Set(posts.map((p) => p.category)));

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.status !== 'all' || filters.sortBy !== 'newest';

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
            <h1 className="text-[#0A0A0A] text-2xl sm:text-3xl">Notifications</h1>
            <p className="text-[#0A0A0A]/60 text-sm sm:text-base">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              {hasActiveFilters && ' (filtered)'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-[#004AAD] flex-1 sm:flex-initial">
              <Link to="/admin/notifications/create">
                <Plus className="w-4 h-4 mr-2" />
                Create New Post
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
              <h3 className="text-[#0A0A0A] text-sm">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  <X className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="text-xs text-[#0A0A0A]/60 mb-1.5 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/40" />
                  <Input
                    placeholder="Search posts..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#0A0A0A]/60 mb-1.5 block">Category</label>
                <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-[#0A0A0A]/60 mb-1.5 block">Status</label>
                <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-[#0A0A0A]/60 mb-1.5 block">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(v) => setFilters({ ...filters, sortBy: v })}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Posts List with Checkboxes */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredPosts.length && filteredPosts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-[#004AAD] rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-[#0A0A0A]/60 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs text-[#0A0A0A]/60 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs text-[#0A0A0A]/60 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-[#0A0A0A]/60 uppercase">Views</th>
                  <th className="px-4 py-3 text-left text-xs text-[#0A0A0A]/60 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs text-[#0A0A0A]/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[#F5F5F5] transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(post.id)}
                          onChange={() => toggleSelect(post.id)}
                          className="w-4 h-4 text-[#004AAD] rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/notifications/edit/${post.id}`} className="hover:text-[#004AAD]">
                          <p className="text-sm max-w-xs truncate">{post.title}</p>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD] text-xs">
                          {post.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-[#0A0A0A]/60">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#0A0A0A]/60">{formatDate(post.date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/admin/notifications/edit/${post.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(post.id)}>
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
                        icon={Search}
                        title="No posts found"
                        description={hasActiveFilters ? 'Try adjusting your filters' : 'Create your first post to get started'}
                        actionLabel={!hasActiveFilters ? 'Create Post' : undefined}
                        onAction={!hasActiveFilters ? () => navigate('/admin/notifications/create') : undefined}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post.id)}
                      onChange={() => toggleSelect(post.id)}
                      className="w-4 h-4 text-[#004AAD] rounded mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/admin/notifications/edit/${post.id}`}>
                        <h3 className="text-[#0A0A0A] mb-2 line-clamp-2">{post.title}</h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD] text-xs">
                          {post.category}
                        </Badge>
                        <StatusBadge status={post.status} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#0A0A0A]/60 mb-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views}
                        </div>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/admin/notifications/edit/${post.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(post.id)}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Search}
                title="No posts found"
                description={hasActiveFilters ? 'Try adjusting your filters' : 'Create your first post to get started'}
                actionLabel={!hasActiveFilters ? 'Create Post' : undefined}
                onAction={!hasActiveFilters ? () => navigate('/admin/notifications/create') : undefined}
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
            <AlertDialogDescription className="text-sm">
              This action cannot be undone. This will permanently delete the post and remove it
              from the database.
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