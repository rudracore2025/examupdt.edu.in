import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Filter, X, Search, Briefcase } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
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
import { adminJobsApi, Job } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    jobMode: 'all',
    status: 'all',
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const data = await adminJobsApi.getAll();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.jobMode !== 'all') {
      filtered = filtered.filter((job) => job.jobMode === filters.jobMode);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((job) => job.status === filters.status);
    }

    if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.posted_date).getTime() - new Date(b.posted_date).getTime());
    }

    setFilteredJobs(filtered);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminJobsApi.delete(deleteId);
      setJobs(jobs.filter((j) => j.id !== deleteId));
      toast.success('Job deleted successfully');
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete job:', error);
      toast.error('Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsDeleting(true);
      await Promise.all(selectedIds.map((id) => adminJobsApi.delete(id)));
      setJobs(jobs.filter((j) => !selectedIds.includes(j.id)));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} jobs deleted successfully`);
    } catch (error) {
      console.error('Failed to delete jobs:', error);
      toast.error('Failed to delete jobs');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredJobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredJobs.map((j) => j.id));
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
      jobMode: 'all',
      status: 'all',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.search || filters.jobMode !== 'all' || filters.status !== 'all';

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
            <h1 className="text-[#0A0A0A]">Jobs</h1>
            <p className="text-[#0A0A0A]/60">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
              {hasActiveFilters && ' (filtered)'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-[#004AAD] flex-1 sm:flex-initial">
              <Link to="/admin/jobs/create">
                <Plus className="w-4 h-4 mr-2" />
                Add New Job
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="text-[#0A0A0A]/60 mb-1.5 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/40" />
                  <Input
                    placeholder="Search jobs..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#0A0A0A]/60 mb-1.5 block">Job Mode</label>
                <Select value={filters.jobMode} onValueChange={(v) => setFilters({ ...filters, jobMode: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[#0A0A0A]/60 mb-1.5 block">Status</label>
                <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
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

        {/* Jobs List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredJobs.length && filteredJobs.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-[#004AAD] rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Job Title</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Mode</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#F5F5F5] transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(job.id)}
                          onChange={() => toggleSelect(job.id)}
                          className="w-4 h-4 text-[#004AAD] rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-xs truncate">{job.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {job.companyLogo && (
                            <img src={job.companyLogo} alt={job.company} className="w-6 h-6 rounded object-cover" />
                          )}
                          <span className="truncate max-w-[150px]">{job.company}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#0A0A0A]/60">{job.location}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={
                          job.jobMode === 'Remote' ? 'bg-green-500/10 text-green-600' :
                          job.jobMode === 'Hybrid' ? 'bg-blue-500/10 text-blue-600' :
                          'bg-orange-500/10 text-orange-600'
                        }>
                          {job.jobMode}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-4 py-3 text-[#0A0A0A]/60">{formatDate(job.posted_date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/admin/jobs/edit/${job.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(job.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState
                        icon={Briefcase}
                        title="No jobs found"
                        description={hasActiveFilters ? 'Try adjusting your filters' : 'Add your first job posting to get started'}
                        actionLabel={!hasActiveFilters ? 'Add Job' : undefined}
                        onAction={!hasActiveFilters ? () => navigate('/admin/jobs/create') : undefined}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(job.id)}
                      onChange={() => toggleSelect(job.id)}
                      className="w-4 h-4 text-[#004AAD] rounded mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#0A0A0A] mb-2 line-clamp-2">{job.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        {job.companyLogo && (
                          <img src={job.companyLogo} alt={job.company} className="w-5 h-5 rounded object-cover" />
                        )}
                        <span className="text-[#0A0A0A]/80">{job.company}</span>
                      </div>
                      <p className="text-[#0A0A0A]/60 mb-2">{job.location}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className={
                          job.jobMode === 'Remote' ? 'bg-green-500/10 text-green-600' :
                          job.jobMode === 'Hybrid' ? 'bg-blue-500/10 text-blue-600' :
                          'bg-orange-500/10 text-orange-600'
                        }>
                          {job.jobMode}
                        </Badge>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="text-[#0A0A0A]/60 mb-3">{formatDate(job.posted_date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/admin/jobs/edit/${job.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(job.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No jobs found"
                description={hasActiveFilters ? 'Try adjusting your filters' : 'Add your first job posting to get started'}
                actionLabel={!hasActiveFilters ? 'Add Job' : undefined}
                onAction={!hasActiveFilters ? () => navigate('/admin/jobs/create') : undefined}
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
              This action cannot be undone. This will permanently delete the job posting.
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