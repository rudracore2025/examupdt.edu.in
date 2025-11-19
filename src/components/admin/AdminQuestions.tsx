import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Filter, X, Search, FileQuestion } from 'lucide-react';
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
import { adminQuestionsApi, Question } from '../../utils/adminApi';
import { toast } from 'sonner@2.0.3';

export function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    subject: 'all',
    difficulty: 'all',
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, filters]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await adminQuestionsApi.getAll();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (question) =>
          question.title.toLowerCase().includes(searchLower) ||
          question.subject.toLowerCase().includes(searchLower) ||
          question.topic.toLowerCase().includes(searchLower)
      );
    }

    if (filters.subject !== 'all') {
      filtered = filtered.filter((question) => question.subject === filters.subject);
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter((question) => question.difficulty === filters.difficulty);
    }

    if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
    }

    setFilteredQuestions(filtered);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminQuestionsApi.delete(deleteId);
      setQuestions(questions.filter((q) => q.id !== deleteId));
      toast.success('Question deleted successfully');
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error('Failed to delete question');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsDeleting(true);
      await Promise.all(selectedIds.map((id) => adminQuestionsApi.delete(id)));
      setQuestions(questions.filter((q) => !selectedIds.includes(q.id)));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} questions deleted successfully`);
    } catch (error) {
      console.error('Failed to delete questions:', error);
      toast.error('Failed to delete questions');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuestions.map((q) => q.id));
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
      subject: 'all',
      difficulty: 'all',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.search || filters.subject !== 'all' || filters.difficulty !== 'all';

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
            <h1 className="text-[#0A0A0A]">Important Questions</h1>
            <p className="text-[#0A0A0A]/60">
              {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}
              {hasActiveFilters && ' (filtered)'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-[#004AAD] flex-1 sm:flex-initial">
              <Link to="/admin/questions/create">
                <Plus className="w-4 h-4 mr-2" />
                Add New Question
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
                    placeholder="Search questions..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#0A0A0A]/60 mb-1.5 block">Subject</label>
                <Select value={filters.subject} onValueChange={(v) => setFilters({ ...filters, subject: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
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
              <div>
                <label className="text-[#0A0A0A]/60 mb-1.5 block">Difficulty</label>
                <Select value={filters.difficulty} onValueChange={(v) => setFilters({ ...filters, difficulty: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulty</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
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

        {/* Questions List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredQuestions.length && filteredQuestions.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-[#004AAD] rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Question Title</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Topic</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Difficulty</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-[#0A0A0A]/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => (
                    <tr key={question.id} className="hover:bg-[#F5F5F5] transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(question.id)}
                          onChange={() => toggleSelect(question.id)}
                          className="w-4 h-4 text-[#004AAD] rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-md truncate">{question.title}</p>
                      </td>
                      <td className="px-4 py-3 text-[#0A0A0A]/80">{question.subject}</td>
                      <td className="px-4 py-3 text-[#0A0A0A]/60">{question.topic}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={
                          question.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600' :
                          question.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-red-500/10 text-red-600'
                        }>
                          {question.difficulty}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[#0A0A0A]/60">{formatDate(question.createdDate)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/admin/questions/edit/${question.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(question.id)}>
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
                        icon={FileQuestion}
                        title="No questions found"
                        description={hasActiveFilters ? 'Try adjusting your filters' : 'Add your first important question to get started'}
                        actionLabel={!hasActiveFilters ? 'Add Question' : undefined}
                        onAction={!hasActiveFilters ? () => navigate('/admin/questions/create') : undefined}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <div key={question.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(question.id)}
                      onChange={() => toggleSelect(question.id)}
                      className="w-4 h-4 text-[#004AAD] rounded mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#0A0A0A] mb-2 line-clamp-2">{question.title}</h3>
                      <p className="text-[#0A0A0A]/80 mb-1">{question.subject}</p>
                      <p className="text-[#0A0A0A]/60 mb-2">{question.topic}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className={
                          question.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600' :
                          question.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-red-500/10 text-red-600'
                        }>
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="text-[#0A0A0A]/60 mb-3">{formatDate(question.createdDate)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/admin/questions/edit/${question.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(question.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={FileQuestion}
                title="No questions found"
                description={hasActiveFilters ? 'Try adjusting your filters' : 'Add your first important question to get started'}
                actionLabel={!hasActiveFilters ? 'Add Question' : undefined}
                onAction={!hasActiveFilters ? () => navigate('/admin/questions/create') : undefined}
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
              This action cannot be undone. This will permanently delete the question.
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
