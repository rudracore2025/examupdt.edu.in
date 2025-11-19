import { Link } from 'react-router-dom';
import { Bell, Award, BookOpen, HelpCircle, Briefcase, Video, TrendingUp, Clock } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { postsApi, Post } from '../utils/api';

const categories = [
  { icon: Bell, label: 'Updates', path: '/notifications', color: 'bg-blue-500' },
  { icon: Award, label: 'Results', path: '/results', color: 'bg-green-500' },
  { icon: BookOpen, label: 'Notes', path: '/notes', color: 'bg-purple-500' },
  { icon: HelpCircle, label: 'Questions', path: '/important-questions', color: 'bg-orange-500' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs-internships', color: 'bg-pink-500' },
  { icon: Video, label: 'Videos', path: '/youtube', color: 'bg-red-500' },
];

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await postsApi.getAll();
        // Filter published posts and get latest 6
        const published = posts.filter(p => p.status === 'published').slice(0, 6);
        setLatestPosts(published);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#004AAD] to-[#0066DD] text-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-white mb-4">
              All JNTUH Updates in One Place
            </h1>
            <p className="text-white/90 text-lg mb-8">
              Stay updated with exam schedules, results, notes, important questions, job opportunities, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-[#004AAD] hover:bg-white/90">
                <Link to="/notifications">
                  <Bell className="w-5 h-5 mr-2" />
                  Latest Updates
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                <Link to="/results">
                  <Award className="w-5 h-5 mr-2" />
                  Check Results
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Category Shortcuts */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-[#0A0A0A] mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.path}
                to={category.path}
                className="bg-white rounded-xl p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[#0A0A0A] text-center text-sm">{category.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Posts Feed */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0A0A0A]">Latest Updates</h2>
          <Button asChild variant="ghost">
            <Link to="/notifications">View All</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="block bg-white rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                      {post.category}
                    </Badge>
                    {post.trending && (
                      <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-[#0A0A0A] mb-2">{post.title}</h3>
                  <p className="text-[#0A0A0A]/60 text-sm mb-4 line-clamp-2">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-2 text-[#0A0A0A]/40 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(post.date)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <p className="text-[#0A0A0A]/60">No posts available yet. Check back soon!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AdSense Vertical */}
            <AdSenseSlot format="vertical" />

            {/* Trending Updates */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-[#0A0A0A] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#004AAD]" />
                Trending Now
              </h3>
              <div className="space-y-3">
                {latestPosts.filter(p => p.trending).slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="block group"
                  >
                    <p className="text-[#0A0A0A] text-sm group-hover:text-[#004AAD] transition-colors mb-1">
                      {post.title}
                    </p>
                    <p className="text-[#0A0A0A]/40 text-xs">{formatTimeAgo(post.date)}</p>
                  </Link>
                ))}
                {latestPosts.filter(p => p.trending).length === 0 && (
                  <p className="text-[#0A0A0A]/60 text-sm">No trending posts yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom AdSense */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>
    </div>
  );
}