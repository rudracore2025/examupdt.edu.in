import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// ============================================
// POSTS ENDPOINTS
// ============================================

// Get all posts (with optional category filter)
app.get('/make-server-9bc82941/posts', async (c) => {
  try {
    const category = c.req.query('category');
    
    let posts = await kv.getByPrefix('post:');
    
    if (category && category !== 'All') {
      posts = posts.filter(post => post.category === category);
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return c.json({ success: false, error: 'Failed to fetch posts' }, 500);
  }
});

// Get single post by ID
app.get('/make-server-9bc82941/posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const post = await kv.get(`post:${id}`);
    
    if (!post) {
      return c.json({ success: false, error: 'Post not found' }, 404);
    }
    
    // Increment view count
    post.views = (post.views || 0) + 1;
    await kv.set(`post:${id}`, post);
    
    return c.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return c.json({ success: false, error: 'Failed to fetch post' }, 500);
  }
});

// Create new post (admin only)
app.post('/make-server-9bc82941/posts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { title, content, category, tags, status, attachments, youtubeLinks } = body;
    
    // Generate unique ID
    const id = Date.now().toString();
    const post = {
      id,
      title,
      content,
      category,
      tags: tags || [],
      status: status || 'draft',
      attachments: attachments || [],
      youtubeLinks: youtubeLinks || [],
      date: new Date().toISOString(),
      views: 0,
      author: user.email,
    };
    
    await kv.set(`post:${id}`, post);
    
    return c.json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    return c.json({ success: false, error: 'Failed to create post' }, 500);
  }
});

// Update post (admin only)
app.put('/make-server-9bc82941/posts/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const id = c.req.param('id');
    const existingPost = await kv.get(`post:${id}`);
    
    if (!existingPost) {
      return c.json({ success: false, error: 'Post not found' }, 404);
    }
    
    const body = await c.req.json();
    const updatedPost = { ...existingPost, ...body, updatedAt: new Date().toISOString() };
    
    await kv.set(`post:${id}`, updatedPost);
    
    return c.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return c.json({ success: false, error: 'Failed to update post' }, 500);
  }
});

// Delete post (admin only)
app.delete('/make-server-9bc82941/posts/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const id = c.req.param('id');
    await kv.del(`post:${id}`);
    
    return c.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return c.json({ success: false, error: 'Failed to delete post' }, 500);
  }
});

// ============================================
// RESULTS ENDPOINTS
// ============================================

app.get('/make-server-9bc82941/results', async (c) => {
  try {
    const exam = c.req.query('exam');
    let results = await kv.getByPrefix('result:');
    
    if (exam && exam !== 'All') {
      results = results.filter(result => result.exam === exam);
    }
    
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ success: true, results });
  } catch (error) {
    console.error('Error fetching results:', error);
    return c.json({ success: false, error: 'Failed to fetch results' }, 500);
  }
});

// ============================================
// NOTES ENDPOINTS
// ============================================

app.get('/make-server-9bc82941/notes', async (c) => {
  try {
    const semester = c.req.query('semester');
    let notes = await kv.getByPrefix('note:');
    
    if (semester && semester !== 'All') {
      notes = notes.filter(note => note.semester === semester);
    }
    
    return c.json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return c.json({ success: false, error: 'Failed to fetch notes' }, 500);
  }
});

// ============================================
// JOBS & INTERNSHIPS ENDPOINTS
// ============================================

app.get('/make-server-9bc82941/jobs', async (c) => {
  try {
    const jobs = await kv.getByPrefix('job:');
    jobs.sort((a, b) => new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime());
    
    return c.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return c.json({ success: false, error: 'Failed to fetch jobs' }, 500);
  }
});

app.get('/make-server-9bc82941/internships', async (c) => {
  try {
    const internships = await kv.getByPrefix('internship:');
    internships.sort((a, b) => new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime());
    
    return c.json({ success: true, internships });
  } catch (error) {
    console.error('Error fetching internships:', error);
    return c.json({ success: false, error: 'Failed to fetch internships' }, 500);
  }
});

// ============================================
// CONTACT MESSAGES ENDPOINT
// ============================================

app.post('/make-server-9bc82941/contact', async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, message } = body;
    
    const id = Date.now().toString();
    const contactMessage = {
      id,
      name,
      email,
      message,
      date: new Date().toISOString(),
      status: 'unread',
    };
    
    await kv.set(`contact:${id}`, contactMessage);
    
    return c.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return c.json({ success: false, error: 'Failed to send message' }, 500);
  }
});

// Get all contact messages (admin only)
app.get('/make-server-9bc82941/contact/all', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const messages = await kv.getByPrefix('contact:');
    messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return c.json({ success: false, error: 'Failed to fetch messages' }, 500);
  }
});

// Mark message as read (admin only)
app.put('/make-server-9bc82941/contact/:id/read', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const id = c.req.param('id');
    const message = await kv.get(`contact:${id}`);
    
    if (!message) {
      return c.json({ success: false, error: 'Message not found' }, 404);
    }
    
    message.status = 'read';
    await kv.set(`contact:${id}`, message);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return c.json({ success: false, error: 'Failed to update message' }, 500);
  }
});

// Delete contact message (admin only)
app.delete('/make-server-9bc82941/contact/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const id = c.req.param('id');
    await kv.del(`contact:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return c.json({ success: false, error: 'Failed to delete message' }, 500);
  }
});

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Get current session
app.get('/make-server-9bc82941/auth/session', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: 'No token provided' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ success: false, error: 'Invalid session' }, 401);
    }
    
    return c.json({ success: true, user });
  } catch (error) {
    console.error('Error checking session:', error);
    return c.json({ success: false, error: 'Failed to check session' }, 500);
  }
});

// ============================================
// ANALYTICS ENDPOINT
// ============================================

app.get('/make-server-9bc82941/analytics', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const posts = await kv.getByPrefix('post:');
    const contacts = await kv.getByPrefix('contact:');
    
    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const unreadMessages = contacts.filter(c => c.status === 'unread').length;
    
    // Category breakdown
    const categories: Record<string, number> = {};
    posts.forEach(post => {
      categories[post.category] = (categories[post.category] || 0) + 1;
    });
    
    return c.json({
      success: true,
      analytics: {
        totalPosts,
        publishedPosts,
        totalViews,
        unreadMessages,
        categories,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ success: false, error: 'Failed to fetch analytics' }, 500);
  }
});

// Health check
app.get('/make-server-9bc82941/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);