import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Filter } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { postsApi, Post } from '../utils/api';

const categories = ['All', 'Exams', 'Notifications', 'Events', 'Classes', 'Results'];

export function NotificationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [allUpdates, setAllUpdates] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await postsApi.getAll(selectedCategory);
        // Filter published posts
        const published = posts.filter(p => p.status === 'published');
        setAllUpdates(published);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchData();
  }, [selectedCategory]);

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  const filteredUpdates = allUpdates;
  const trendingUpdates = allUpdates.filter(update => update.trending);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-[#0A0A0A] mb-2">JNTUH Updates</h1>
          <p className="text-[#0A0A0A]/60">Stay informed with the latest notifications and announcements</p>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-[#0A0A0A]/60 flex-shrink-0" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-[#004AAD]' : ''}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Updates List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredUpdates.length > 0 ? (
              filteredUpdates.map((update) => (
                <Link
                  key={update.id}
                  to={`/post/${update.id}`}
                  className="block bg-white rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                        {update.category}
                      </Badge>
                      {update.trending && (
                        <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[#0A0A0A]/40 text-sm flex-shrink-0">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(update.date)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-[#0A0A0A] mb-2">{update.title}</h3>
                  <p className="text-[#0A0A0A]/60 text-sm mb-4 line-clamp-2">
                    {update.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                  </p>
                  
                  {update.attachments && update.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {update.attachments.map((attachment, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          📎 {attachment.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {update.tags && update.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-gray-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <p className="text-[#0A0A0A]/60">No updates available yet. Check back soon!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AdSense */}
            <AdSenseSlot format="vertical" />

            {/* Trending Updates */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-[#0A0A0A] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#004AAD]" />
                Trending Updates
              </h3>
              <div className="space-y-4">
                {trendingUpdates.map((update) => (
                  <Link
                    key={update.id}
                    to={`/post/${update.id}`}
                    className="block group"
                  >
                    <p className="text-[#0A0A0A] text-sm group-hover:text-[#004AAD] transition-colors mb-1">
                      {update.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs bg-[#004AAD]/10 text-[#004AAD]">
                        {update.category}
                      </Badge>
                      <p className="text-[#0A0A0A]/40 text-xs">{formatTimeAgo(update.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-[#0A0A0A] mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/results" className="block text-[#004AAD] text-sm hover:underline">
                  → Check Results
                </Link>
                <Link to="/notes" className="block text-[#004AAD] text-sm hover:underline">
                  → Download Notes
                </Link>
                <Link to="/important-questions" className="block text-[#004AAD] text-sm hover:underline">
                  → Important Questions
                </Link>
                <Link to="/jobs-internships" className="block text-[#004AAD] text-sm hover:underline">
                  → Job Opportunities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}