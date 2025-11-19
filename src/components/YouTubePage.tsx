import { useState, useEffect } from 'react';
import { Video, Play, Clock, Eye, Filter } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { LoadingScreen } from './LoadingScreen';
import { youtubeApi, YouTubeVideo } from '../utils/api';

const categories = ['All', 'Tutorial', 'Questions', 'Tips', 'Lectures'];

export function YouTubePage() {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const data = await youtubeApi.getAll(selectedCategory);
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setVideos([]);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const getYouTubeVideoId = (url: string): string => {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return url; // Return as-is if no pattern matches
  };

  const getThumbnailUrl = (videoUrl: string, customThumbnail?: string): string => {
    if (customThumbnail) return customThumbnail;
    const videoId = getYouTubeVideoId(videoUrl);
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const getEmbedUrl = (videoUrl: string, customEmbed?: string): string => {
    if (customEmbed) return customEmbed;
    const videoId = getYouTubeVideoId(videoUrl);
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-[#0A0A0A] mb-2">Educational Videos</h1>
          <p className="text-[#0A0A0A]/60">Watch curated educational content for JNTUH students</p>
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

      {/* Videos Grid */}
      <section className="container mx-auto px-4 py-8">
        {videos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-900">
                  <img
                    src={getThumbnailUrl(video.video_link, video.thumbnail_url)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#004AAD] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="text-[#0A0A0A] line-clamp-2 group-hover:text-[#004AAD] transition-colors">
                    {video.title}
                  </h3>

                  {video.description && (
                    <p className="text-[#0A0A0A]/60 text-sm line-clamp-2">
                      {video.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD] text-xs">
                      {video.category}
                    </Badge>
                    {video.views && (
                      <div className="flex items-center gap-1 text-[#0A0A0A]/40">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">{video.views.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[#0A0A0A]/40 text-xs">
                    <span>{formatDate(video.uploadeddate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Video className="w-12 h-12 text-[#0A0A0A]/20 mx-auto mb-4" />
            <p className="text-[#0A0A0A]/60">No videos available yet.</p>
            <p className="text-[#0A0A0A]/40 mt-2">Check back later for educational content!</p>
          </div>
        )}
      </section>

      {/* Bottom AdSense */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                width="100%"
                height="100%"
                src={getEmbedUrl(selectedVideo.video_link, selectedVideo.embed_link)}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-t-lg"
              />
            )}
          </div>
          {selectedVideo && (
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="text-[#0A0A0A]">{selectedVideo.title}</DialogTitle>
              </DialogHeader>
              {selectedVideo.description && (
                <p className="text-[#0A0A0A]/60 mt-4">{selectedVideo.description}</p>
              )}
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                  {selectedVideo.category}
                </Badge>
                {selectedVideo.views && (
                  <div className="flex items-center gap-1 text-[#0A0A0A]/60">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{selectedVideo.views.toLocaleString()} views</span>
                  </div>
                )}
                <span className="text-[#0A0A0A]/40 text-sm">{formatDate(selectedVideo.uploadeddate)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}