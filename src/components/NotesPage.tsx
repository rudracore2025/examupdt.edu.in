import { useState, useEffect } from 'react';
import { BookOpen, Download, Eye, FileText, FileSpreadsheet, Video, AlertCircle } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LoadingScreen } from './LoadingScreen';
import { notesApi, Note } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function NotesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [notesData, setNotesData] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const notes = await notesApi.getAll();
      setNotesData(notes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotesData([]);
      toast.error('Failed to load notes');
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toUpperCase();
    if (type === 'PDF') return <FileText className="w-16 h-16 text-white/80" />;
    if (type === 'DOC' || type === 'DOCX') return <FileSpreadsheet className="w-16 h-16 text-white/80" />;
    if (type === 'PPT' || type === 'PPTX') return <FileSpreadsheet className="w-16 h-16 text-white/80" />;
    if (type === 'VIDEO' || type === 'MP4') return <Video className="w-16 h-16 text-white/80" />;
    return <BookOpen className="w-16 h-16 text-white/80" />;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getFileTypeFromUrl = (url: string): string => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
    if (urlLower.includes('drive.google.com')) {
      if (urlLower.includes('/document/')) return 'google-docs';
      if (urlLower.includes('/presentation/')) return 'google-slides';
      if (urlLower.includes('/spreadsheets/')) return 'google-sheets';
      return 'google-drive';
    }
    if (urlLower.endsWith('.pdf')) return 'pdf';
    if (urlLower.endsWith('.doc') || urlLower.endsWith('.docx')) return 'doc';
    if (urlLower.endsWith('.ppt') || urlLower.endsWith('.pptx')) return 'ppt';
    if (urlLower.endsWith('.mp4') || urlLower.endsWith('.avi') || urlLower.endsWith('.mkv')) return 'video';
    return 'unknown';
  };

  const handlePreview = async (note: Note) => {
    if (!note.file_url || !isValidUrl(note.file_url)) {
      toast.error('Invalid preview link. Please contact the admin of the site.');
      return;
    }

    const fileType = getFileTypeFromUrl(note.file_url);

    try {
      if (fileType === 'youtube') {
        // Open YouTube links in YouTube app or browser
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
        toast.success('Opening video...');
      } else if (fileType === 'google-docs' || fileType === 'google-slides' || fileType === 'google-sheets') {
        // Open Google Docs/Slides/Sheets in new tab
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
        toast.success('Opening document...');
      } else if (fileType === 'pdf') {
        // For PDF files, try to open with PDF viewer
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(note.file_url)}&embedded=true`;
        window.open(viewerUrl, '_blank', 'noopener,noreferrer');
        toast.success('Opening PDF...');
      } else if (fileType === 'doc' || fileType === 'ppt') {
        // For Office documents, use Google Docs viewer
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(note.file_url)}&embedded=true`;
        window.open(viewerUrl, '_blank', 'noopener,noreferrer');
        toast.success('Opening document...');
      } else if (fileType === 'video') {
        // For video files, open directly
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
        toast.success('Opening video...');
      } else {
        // For unknown types, just open in new tab
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
        toast.success('Opening file...');
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to open preview. Please try downloading instead.');
    }
  };

  const handleDownload = async (note: Note) => {
    if (!note.file_url || !isValidUrl(note.file_url)) {
      toast.error('Invalid download link provided. Kindly contact the admin of the site.', {
        duration: 5000,
        icon: <AlertCircle className="w-5 h-5" />,
      });
      return;
    }

    try {
      // Check if the URL is accessible
      const response = await fetch(note.file_url, { method: 'HEAD' });
      
      if (!response.ok) {
        toast.error('Invalid download link provided. Kindly contact the admin of the site.', {
          duration: 5000,
          icon: <AlertCircle className="w-5 h-5" />,
        });
        return;
      }

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = note.file_url;
      link.download = note.title || 'download';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${note.title}...`);

      // Increment download count (optional - update in database)
      // You can add an API call here to increment the download count
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Invalid download link provided. Kindly contact the admin of the site.', {
        duration: 5000,
        icon: <AlertCircle className="w-5 h-5" />,
      });
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
          <h1 className="text-[#0A0A0A] mb-2">Study Notes</h1>
          <p className="text-[#0A0A0A]/60">Download comprehensive notes for all subjects</p>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Notes Grid */}
      <section className="container mx-auto px-4 py-8">
        {notesData.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notesData.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Preview Area */}
                <div className="bg-gradient-to-br from-[#004AAD] to-[#0066DD] h-40 flex items-center justify-center">
                  {getFileIcon(note.file_type)}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-[#0A0A0A] mb-1 line-clamp-1" title={note.title}>
                      {note.title}
                    </h3>
                    <p className="text-[#0A0A0A]/60 text-sm line-clamp-1">{note.subject}</p>
                    <p className="text-[#0A0A0A]/50 text-xs line-clamp-1">{note.topic}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD] text-xs">
                      {note.file_type}
                    </Badge>
                    <span className="text-[#0A0A0A]/40 text-xs">{note.fileSize}</span>
                  </div>

                  <div className="text-[#0A0A0A]/40 text-xs">
                    {note.downloads.toLocaleString()} downloads • {note.uploadDate}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handlePreview(note)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#004AAD] hover:bg-[#003580]"
                      onClick={() => handleDownload(note)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <BookOpen className="w-12 h-12 text-[#0A0A0A]/20 mx-auto mb-4" />
            <p className="text-[#0A0A0A]/60">No notes available yet.</p>
            <p className="text-[#0A0A0A]/40 mt-2">Check back later for study materials!</p>
          </div>
        )}
      </section>

      {/* Bottom AdSense */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>
    </div>
  );
}