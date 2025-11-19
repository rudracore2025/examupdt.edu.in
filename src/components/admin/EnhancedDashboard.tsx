import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Bell,
  Award,
  BookOpen,
  HelpCircle,
  Briefcase,
  GraduationCap,
  Video,
  Activity,
  BarChart3,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CardSkeleton, LoadingSkeleton } from './shared/LoadingSkeleton';
import { EmptyState } from './shared/EmptyState';
import { StatusBadge } from './shared/StatusBadge';
import { adminAnalyticsApi, adminPostsApi, AdminPost } from '../../utils/adminApi';

const quickCreateButtons = [
  { label: 'Notification', path: '/admin/notifications/create', icon: Bell, color: 'bg-blue-500' },
  { label: 'Result', path: '/admin/results/create', icon: Award, color: 'bg-green-500' },
  { label: 'Notes', path: '/admin/notes/create', icon: BookOpen, color: 'bg-purple-500' },
  { label: 'Question', path: '/admin/questions/create', icon: HelpCircle, color: 'bg-orange-500' },
  { label: 'Job', path: '/admin/jobs/create', icon: Briefcase, color: 'bg-red-500' },
  { label: 'Internship', path: '/admin/internships/create', icon: GraduationCap, color: 'bg-indigo-500' },
];

export function EnhancedDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    unreadMessages: 0,
    categories: {} as Record<string, number>,
  });
  const [recentPosts, setRecentPosts] = useState<AdminPost[]>([]);
  const [recentActivity, setRecentActivity] = useState<AdminPost[]>([]);
  const [trendData, setTrendData] = useState<{ date: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsData, postsData] = await Promise.all([
        adminAnalyticsApi.getStats(),
        adminPostsApi.getAll(),
      ]);

      // Calculate draft posts
      const draftCount = postsData.filter(p => p.status === 'draft').length;

      setStats({ ...statsData, draftPosts: draftCount });
      setRecentPosts(postsData.slice(0, 5));
      setRecentActivity(postsData.slice(0, 10));

      // Calculate trend data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const trends = last7Days.map(date => ({
        date,
        count: postsData.filter(p => p.date && p.date.startsWith(date)).length,
      }));

      setTrendData(trends);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set empty states on error
      setStats({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
        unreadMessages: 0,
        categories: {},
      });
      setRecentPosts([]);
      setRecentActivity([]);
      setTrendData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getMaxTrend = () => Math.max(...trendData.map(t => t.count), 1);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
          <div className="space-y-1">
            <div className="bg-gray-200 h-8 w-48 rounded animate-pulse"></div>
            <div className="bg-gray-200 h-5 w-64 rounded animate-pulse"></div>
          </div>
          <CardSkeleton count={4} />
          <LoadingSkeleton rows={5} />
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
            <h1 className="text-[#0A0A0A] text-2xl sm:text-3xl">Dashboard</h1>
            <p className="text-[#0A0A0A]/60 text-sm sm:text-base">
              Welcome back! Here's your overview.
            </p>
          </div>
        </div>

        {/* Quick Create Buttons */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
          <h2 className="text-[#0A0A0A] text-base sm:text-lg mb-3 sm:mb-4">Quick Create</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {quickCreateButtons.map((button) => {
              const Icon = button.icon;
              return (
                <Button
                  key={button.path}
                  asChild
                  variant="outline"
                  className="h-auto py-3 sm:py-4 flex flex-col gap-2 hover:bg-[#F5F5F5]"
                >
                  <Link to={button.path}>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${button.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#0A0A0A]">{button.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
            </div>
            <h3 className="text-[#0A0A0A] text-xl sm:text-2xl mb-1">{stats.totalPosts}</h3>
            <p className="text-[#0A0A0A]/60 text-xs sm:text-sm">Total Posts</p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
            </div>
            <h3 className="text-[#0A0A0A] text-xl sm:text-2xl mb-1">{stats.publishedPosts}</h3>
            <p className="text-[#0A0A0A]/60 text-xs sm:text-sm">Published</p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
            </div>
            <h3 className="text-[#0A0A0A] text-xl sm:text-2xl mb-1">{stats.draftPosts}</h3>
            <p className="text-[#0A0A0A]/60 text-xs sm:text-sm">Drafts</p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              </div>
            </div>
            <h3 className="text-[#0A0A0A] text-xl sm:text-2xl mb-1">{stats.unreadMessages}</h3>
            <p className="text-[#0A0A0A]/60 text-xs sm:text-sm">Unread Messages</p>
          </div>
        </div>

        {/* Activity Trend Chart */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#004AAD]" />
            <h2 className="text-[#0A0A0A] text-base sm:text-lg">Activity Trend (Last 7 Days)</h2>
          </div>
          <div className="flex items-end justify-between gap-2 h-32 sm:h-40">
            {trendData.map((day, index) => {
              const height = (day.count / getMaxTrend()) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#F5F5F5] rounded-t relative flex-1 flex items-end">
                    <div
                      className="w-full bg-[#004AAD] rounded-t transition-all hover:bg-[#003380] cursor-pointer relative group"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`${day.count} posts`}
                    >
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-[#0A0A0A] opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.count}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-[#0A0A0A]/60">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Posts */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-[#0A0A0A] text-lg sm:text-xl">Recent Posts</h2>
              <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm">
                <Link to="/admin/notifications">View All</Link>
              </Button>
            </div>
            <div className="divide-y divide-gray-200">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/admin/notifications/edit/${post.id}`}
                    className="block p-4 sm:p-6 hover:bg-[#F5F5F5] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                      <h3 className="text-[#0A0A0A] text-sm sm:text-base flex-1 line-clamp-2">
                        {post.title}
                      </h3>
                      <StatusBadge status={post.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#0A0A0A]/60">
                      <span className="truncate">{post.category}</span>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        {post.views}
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatTimeAgo(post.date)}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No posts yet"
                  description="Create your first post to get started"
                  actionLabel="Create Post"
                  onAction={() => navigate('/admin/notifications/create')}
                />
              )}
            </div>
          </div>

          {/* Categories & Recent Activity */}
          <div className="space-y-4 sm:space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-[#0A0A0A] text-lg sm:text-xl">Categories</h2>
              </div>
              <div className="p-4 sm:p-6">
                {Object.keys(stats.categories).length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(stats.categories).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-[#0A0A0A] text-sm truncate flex-1 mr-2">
                          {category}
                        </span>
                        <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD] text-xs flex-shrink-0">
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-[#0A0A0A]/20 mx-auto mb-4" />
                    <p className="text-[#0A0A0A]/60 text-xs sm:text-sm">No categories yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#004AAD]" />
                <h2 className="text-[#0A0A0A] text-lg sm:text-xl">Recent Activity</h2>
              </div>
              <div className="p-4 sm:p-6 max-h-80 overflow-y-auto">
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.slice(0, 10).map((post) => (
                      <div key={post.id} className="text-sm">
                        <p className="text-[#0A0A0A] line-clamp-1 mb-1">{post.title}</p>
                        <p className="text-[#0A0A0A]/60 text-xs">{formatTimeAgo(post.date)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#0A0A0A]/60 text-xs sm:text-sm text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}