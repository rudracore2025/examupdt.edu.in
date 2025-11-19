import { supabase } from './supabase';

export interface AdminPost {
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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'unread' | 'read';
  reply?: string;
  replied_at?: string;
}

export interface ExamResult {
  id: string;
  title: string;
  exam_type: 'B.Tech' | 'M.Tech' | 'PharmD';
  semester: string;
  year: number;
  link: string;
  pdf_file?: string;
  status: 'Released' | 'Pending' | 'Updated';
  date: string;
  views: number;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  topic: string;
  file_url: string;
  file_size: number;
  file_type: 'PDF' | 'DOC' | 'PPT' | 'ZIP';
  thumbnail?: string;
  uploadDate: string;
  downloads: number;
}

export interface Question {
  id: string;
  title: string;
  subject: string;
  topic: string;
  content: string;
  image_url?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  created_at: string;
  views?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  companyLogo?: string;
  salary?: string;
  jobMode: 'Remote' | 'Hybrid' | 'Onsite';
  job_mode?: 'Remote' | 'Hybrid' | 'Onsite';
  location: string;
  description: string;
  apply_link: string;
  status: 'Active' | 'Closed';
  postedDate: string;
  posted_date?: string;
  applicants?: number;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  stipend?: string;
  duration: string;
  mode: 'Remote' | 'Hybrid' | 'Onsite';
  location: string;
  description: string;
  apply_link: string;
  status: 'Active' | 'Closed';
  posted_date: string;
  postedDate?: string;
  applicants?: number;
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
  views?: number;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  unreadMessages: number;
  categories: Record<string, number>;
}

// Posts Management (Notifications)
export const adminPostsApi = {
  getAll: async (category?: string): Promise<AdminPost[]> => {
    let query = supabase.from('posts').select('*').order('date', { ascending: false });
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<AdminPost | null> => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  create: async (post: Partial<AdminPost>): Promise<AdminPost> => {
    const { data, error } = await supabase.from('posts').insert([post]).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, post: Partial<AdminPost>): Promise<AdminPost> => {
    const { data, error } = await supabase.from('posts').update(post).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  },
};

// Contact Messages
export const adminMessagesApi = {
  getAll: async (): Promise<ContactMessage[]> => {
    const { data, error } = await supabase.from('contact_messages').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  markAsRead: async (id: string): Promise<void> => {
    const { error } = await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    if (error) throw error;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
  },
};

// Dashboard Analytics
export const adminAnalyticsApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data: posts } = await supabase.from('posts').select('*');
    const { data: messages } = await supabase.from('contact_messages').select('*').eq('status', 'unread');

    const totalPosts = posts?.length || 0;
    const publishedPosts = posts?.filter((p) => p.status === 'published').length || 0;
    const totalViews = posts?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
    const unreadMessages = messages?.length || 0;

    const categories: Record<string, number> = {};
    posts?.forEach((post) => {
      categories[post.category] = (categories[post.category] || 0) + 1;
    });

    return {
      totalPosts,
      publishedPosts,
      totalViews,
      unreadMessages,
      categories,
    };
  },
};

// Results Management
export const adminResultsApi = {
  getAll: async (): Promise<ExamResult[]> => {
    const { data, error } = await supabase.from('results').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<ExamResult | null> => {
    const { data, error } = await supabase.from('results').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  create: async (result: Partial<ExamResult>): Promise<ExamResult> => {
    const { data, error } = await supabase.from('results').insert([result]).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, result: Partial<ExamResult>): Promise<ExamResult> => {
    const { data, error } = await supabase.from('results').update(result).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('results').delete().eq('id', id);
    if (error) throw error;
  },
};

// Notes Management
export const adminNotesApi = {
  getAll: async (): Promise<Note[]> => {
    const { data, error } = await supabase.from('notes').select('*').order('uploadDate', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Note | null> => {
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  create: async (note: Partial<Note>): Promise<Note> => {
    const { data, error } = await supabase.from('notes').insert([note]).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, note: Partial<Note>): Promise<Note> => {
    const { data, error } = await supabase.from('notes').update(note).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
  },
};

// Questions Management
export const adminQuestionsApi = {
  getAll: async (): Promise<Question[]> => {
    const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Question | null> => {
    const { data, error } = await supabase.from('questions').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  create: async (question: Partial<Question>): Promise<Question> => {
    const { data, error } = await supabase.from('questions').insert([question]).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, question: Partial<Question>): Promise<Question> => {
    const { data, error } = await supabase.from('questions').update(question).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) throw error;
  },
};

// Jobs Management
export const adminJobsApi = {
  getAll: async (): Promise<Job[]> => {
    const { data, error } = await supabase.from('jobs').select('*').order('posted_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Job | null> => {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  create: async (job: Partial<Job>): Promise<Job> => {
    const { data, error } = await supabase.from('jobs').insert([job]).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, job: Partial<Job>): Promise<Job> => {
    const { data, error } = await supabase.from('jobs').update(job).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw error;
  },
};

// Internships Management
export const adminInternshipsApi = {
  getAll: async (): Promise<Internship[]> => {
    const { data, error } = await supabase.from('internships').select('*').order('posted_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Internship | null> => {
    const { data, error } = await supabase.from('internships').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  create: async (internship: Partial<Internship>): Promise<Internship> => {
    const { data, error } = await supabase.from('internships').insert([internship]).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, internship: Partial<Internship>): Promise<Internship> => {
    const { data, error } = await supabase.from('internships').update(internship).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('internships').delete().eq('id', id);
    if (error) throw error;
  },
};

// YouTube Links Management
export const adminYouTubeApi = {
  getAll: async (): Promise<YouTubeVideo[]> => {
    const { data, error } = await supabase.from('youtube_videos').select('*').order('uploadedDate', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<YouTubeVideo | null> => {
    const { data, error } = await supabase.from('youtube_videos').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  create: async (video: Partial<YouTubeVideo>): Promise<YouTubeVideo> => {
    const { data, error } = await supabase.from('youtube_videos').insert([video]).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, video: Partial<YouTubeVideo>): Promise<YouTubeVideo> => {
    const { data, error } = await supabase.from('youtube_videos').update(video).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('youtube_videos').delete().eq('id', id);
    if (error) throw error;
  },
};