import { useParams, Link } from 'react-router-dom';
import { Clock, Download, TrendingUp, ArrowLeft } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { postsApi, Post } from '../utils/api';
import { toast } from 'sonner';

export function PostDetailPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const postData = await postsApi.getById(id);
          setPost(postData);
          
          // Fetch trending posts
          const allPosts = await postsApi.getAll();
          const trending = allPosts.filter(p => p.trending && p.id !== id).slice(0, 3);
          setTrendingPosts(trending);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        toast.error('Failed to fetch post');
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchData();
  }, [id]);

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

  const handleAttachmentDownload = (attachment: { name: string; size: string; url?: string }) => {
    if (attachment.url) {
      window.open(attachment.url, '_blank', 'noopener,noreferrer');
      toast.success(`Downloading ${attachment.name}...`);
    } else {
      toast.error('Download link not available');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[#0A0A0A] mb-4">Post not found</h2>
          <Button asChild>
            <Link to="/notifications">Back to Updates</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/notifications">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Updates
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Post Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg p-6 md:p-8 border border-gray-200">
              {/* Meta */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-2 text-[#0A0A0A]/40 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeAgo(post.date)}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-[#0A0A0A] mb-6">{post.title}</h1>

              {/* Content */}
              <div
                className="prose prose-sm md:prose-base max-w-none text-[#0A0A0A]/80"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Attachments */}
              {post.attachments && post.attachments.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-[#0A0A0A] mb-4">Attachments</h3>
                  <div className="space-y-2">
                    {post.attachments.map((attachment, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#004AAD] rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-[#0A0A0A] text-sm">{attachment.name}</p>
                            <p className="text-[#0A0A0A]/40 text-xs">{attachment.size}</p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-[#004AAD]" onClick={() => handleAttachmentDownload(attachment)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* YouTube Links */}
              {post.youtube_links && post.youtube_links.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-[#0A0A0A] mb-4">Related Videos</h3>
                  <div className="space-y-4">
                    {post.youtube_links.map((videoId, idx) => (
                      <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={`Video ${idx + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* AdSense */}
            <div className="mt-6">
              <AdSenseSlot format="horizontal" />
            </div>
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
                {trendingPosts.length > 0 ? (
                  trendingPosts.map((trendingPost) => (
                    <Link
                      key={trendingPost.id}
                      to={`/post/${trendingPost.id}`}
                      className="block group"
                    >
                      <p className="text-[#0A0A0A] text-sm group-hover:text-[#004AAD] transition-colors mb-1">
                        {trendingPost.title}
                      </p>
                      <Badge variant="secondary" className="text-xs bg-[#004AAD]/10 text-[#004AAD]">
                        {trendingPost.category}
                      </Badge>
                    </Link>
                  ))
                ) : (
                  <p className="text-[#0A0A0A]/60 text-sm">No trending posts available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}