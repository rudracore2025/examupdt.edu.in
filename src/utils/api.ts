import { supabase } from './supabase';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  attachments: { name: string; size: string; url?: string }[];
  youtube_links: string[];
  date: string;
  views: number;
  author?: string;
  trending?: boolean;
}

export interface Result {
  id: string;
  title: string;
  exam: string; // This will be mapped from exam_type + semester
  exam_type: string;
  semester: string;
  year: number;
  date: string;
  status: string;
  link: string;
  pdf_file?: string;
  pdfLink: string; // Mapped from link
  views: number;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  topic: string;
  units: string; // Mapped from topic
  semester: string; // Mapped from subject
  file_url: string;
  file_size: number;
  fileSize: string; // Formatted from file_size
  file_type: string;
  downloads: number;
  uploadDate: string;
  upload_date?: string; // Keep for backward compatibility
}

export interface Job {
  id: string;
  type: 'job' | 'internship';
  title: string;
  position: string; // Mapped from title
  company: string;
  location: string;
  salary?: string;
  stipend?: string;
  duration?: string;
  jobMode?: string;
  mode?: string;
  postedTime: string; // Formatted from postedDate
  posted_date: string;
  apply_link: string;
  applyLink: string; // Mapped from apply_link
  description: string;
  status: string;
  trending: boolean;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface Question {
  id: string;
  title: string;
  subject: string;
  topic: string;
  content: string;
  image_url?: string;
  difficulty: string;
  created_at: string;
  views: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  video_link: string;
  description?: string;
  thumbnail_url?: string;
  embed_link?: string;
  category: string;
  uploadedDate: string;
  views: number;
}

// Posts API
export const postsApi = {
  getAll: async (category?: string): Promise<Post[]> => {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('date', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Failed to fetch posts:', error);
      return [];
    }
    return data || [];
  },

  getById: async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();
    
    if (error) {
      console.error('Failed to fetch post:', error);
      return null;
    }
    
    // Increment view count
    if (data) {
      await supabase
        .from('posts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
    }
    
    return data;
  },
};

// Results API
export const resultsApi = {
  getAll: async (examFilter?: string): Promise<Result[]> => {
    let query = supabase
      .from('results')
      .select('*')
      .order('date', { ascending: false });
    
    // Apply exam filter if provided (e.g., "B.Tech 1-1")
    if (examFilter && examFilter !== 'All') {
      // Parse filter like "B.Tech 1-1" into exam_type and semester
      const parts = examFilter.split(' ');
      if (parts.length >= 2) {
        const examType = parts[0]; // "B.Tech", "M.Tech", etc.
        const semester = parts.slice(1).join(' '); // "1-1", "2-2", etc.
        query = query.eq('exam_type', examType);
        if (semester) {
          query = query.ilike('semester', `%${semester}%`);
        }
      }
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Failed to fetch results:', error);
      return [];
    }
    
    // Map data to match the expected Result interface
    return (data || []).map(result => ({
      ...result,
      exam: `${result.exam_type} ${result.semester}`,
      pdfLink: result.link,
    }));
  },
};

// Notes API
export const notesApi = {
  getAll: async (semesterFilter?: string): Promise<Note[]> => {
    let query = supabase
      .from('notes')
      .select('*')
      .order('uploadDate', { ascending: false });
    
    if (semesterFilter && semesterFilter !== 'All') {
      query = query.ilike('subject', `%${semesterFilter}%`);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Failed to fetch notes:', error);
      return [];
    }
    
    // Map data to match the expected Note interface
    return (data || []).map(note => ({
      ...note,
      units: note.topic,
      semester: note.subject,
      fileSize: formatFileSize(note.file_size),
      uploadDate: formatDate(note.uploadDate),
    }));
  },
};

// Jobs API
export const jobsApi = {
  getJobs: async (): Promise<Job[]> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'Active')
      .order('posted_date', { ascending: false });
    
    if (error) {
      console.error('Failed to fetch jobs:', error);
      return [];
    }
    
    // Map data to match the expected Job interface
    return (data || []).map(job => ({
      ...job,
      type: 'job' as const,
      position: job.title,
      applyLink: job.apply_link,
      postedTime: formatTimeAgo(job.posted_date),
      trending: false,
    }));
  },

  getInternships: async (): Promise<Job[]> => {
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .eq('status', 'Active')
      .order('posted_date', { ascending: false });
    
    if (error) {
      console.error('Failed to fetch internships:', error);
      return [];
    }
    
    // Map data to match the expected Job interface
    return (data || []).map(internship => ({
      ...internship,
      type: 'internship' as const,
      position: internship.title,
      applyLink: internship.apply_link,
      postedTime: formatTimeAgo(internship.posted_date),
      trending: false,
    }));
  },
};

// Questions API
export const questionsApi = {
  getAll: async (subject?: string, difficulty?: string): Promise<Question[]> => {
    let query = supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (subject && subject !== 'All') {
      query = query.eq('subject', subject);
    }
    
    if (difficulty && difficulty !== 'All') {
      query = query.eq('difficulty', difficulty);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Failed to fetch questions:', error);
      return [];
    }
    
    return data || [];
  },

  getById: async (id: string): Promise<Question | null> => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Failed to fetch question:', error);
      return null;
    }
    
    // Increment view count
    if (data) {
      await supabase
        .from('questions')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
    }
    
    return data;
  },
};

// YouTube Videos API
export const youtubeApi = {
  getAll: async (category?: string): Promise<YouTubeVideo[]> => {
    let query = supabase
      .from('youtube_videos')
      .select('*')
      .order('uploadedDate', { ascending: false });
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Failed to fetch videos:', error);
      return [];
    }
    
    return data || [];
  },
};

// Contact API
export const contactApi = {
  send: async (message: ContactMessage): Promise<void> => {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name: message.name,
        email: message.email,
        message: message.message,
        status: 'unread',
        date: new Date().toISOString(),
      }]);
    
    if (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message');
    }
  },
};

// Analytics API (for dashboard stats)
export const analyticsApi = {
  get: async (): Promise<any> => {
    // This is typically for admin use, but kept for compatibility
    const { data: posts } = await supabase.from('posts').select('views');
    const { data: results } = await supabase.from('results').select('views');
    const { data: notes } = await supabase.from('notes').select('downloads');
    
    const totalViews = [
      ...(posts || []),
      ...(results || []),
    ].reduce((sum, item) => sum + (item.views || 0), 0);
    
    const totalDownloads = (notes || []).reduce((sum, note) => sum + (note.downloads || 0), 0);
    
    return {
      totalViews,
      totalDownloads,
      totalPosts: posts?.length || 0,
      totalResults: results?.length || 0,
      totalNotes: notes?.length || 0,
    };
  },
};

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}