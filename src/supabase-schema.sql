-- =====================================================
-- EXAMUPDT ADMIN PANEL - SUPABASE DATABASE SCHEMA
-- =====================================================
-- Run this in your Supabase SQL Editor to create all tables
-- https://supabase.com/dashboard/project/liaoirczyteepczsiwxg/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. POSTS (Notifications)
-- =====================================================
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    attachments JSONB DEFAULT '[]'::jsonb,
    youtube_links JSONB DEFAULT '[]'::jsonb,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    author TEXT,
    trending BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CONTACT MESSAGES
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
    reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. EXAM RESULTS
-- =====================================================
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('B.Tech', 'M.Tech', 'PharmD')),
    semester TEXT NOT NULL,
    year INTEGER NOT NULL,
    link TEXT NOT NULL,
    pdf_file TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Released', 'Pending', 'Updated')),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. NOTES
-- =====================================================
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('PDF', 'DOC', 'PPT', 'ZIP')),
    thumbnail TEXT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. IMPORTANT QUESTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. JOBS
-- =====================================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    salary TEXT,
    job_mode TEXT NOT NULL CHECK (job_mode IN ('Remote', 'Hybrid', 'Onsite')),
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    apply_link TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Closed')),
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applicants INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. INTERNSHIPS
-- =====================================================
CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    stipend TEXT,
    duration TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('Remote', 'Hybrid', 'Onsite')),
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    apply_link TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Closed')),
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applicants INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. YOUTUBE VIDEOS
-- =====================================================
CREATE TABLE IF NOT EXISTS youtube_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    video_link TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    embed_link TEXT,
    category TEXT NOT NULL,
    uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_date ON contact_messages(date DESC);
CREATE INDEX IF NOT EXISTS idx_results_exam_type ON results(exam_type);
CREATE INDEX IF NOT EXISTS idx_results_date ON results(date DESC);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_upload_date ON notes(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_created_date ON questions(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_internships_posted_date ON internships(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_category ON youtube_videos(category);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_uploaded_date ON youtube_videos(uploaded_date DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables (for the public website)
CREATE POLICY "Allow public read access on posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on contact_messages" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow public read access on results" ON results FOR SELECT USING (true);
CREATE POLICY "Allow public read access on notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on internships" ON internships FOR SELECT USING (true);
CREATE POLICY "Allow public read access on youtube_videos" ON youtube_videos FOR SELECT USING (true);

-- Allow authenticated users (admin) to perform all operations
CREATE POLICY "Allow authenticated insert on posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on posts" ON posts FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on contact_messages" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on contact_messages" ON contact_messages FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on results" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on results" ON results FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on results" ON results FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on notes" ON notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on notes" ON notes FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on notes" ON notes FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on questions" ON questions FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on questions" ON questions FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on jobs" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on jobs" ON jobs FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on jobs" ON jobs FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on internships" ON internships FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on internships" ON internships FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on internships" ON internships FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on youtube_videos" ON youtube_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on youtube_videos" ON youtube_videos FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on youtube_videos" ON youtube_videos FOR DELETE USING (true);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC updated_at TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON internships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_youtube_videos_updated_at BEFORE UPDATE ON youtube_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - Remove if not needed)
-- =====================================================
-- Sample Post
INSERT INTO posts (title, content, category, tags, status, date, views) VALUES
('B.Tech Results 2024 - Semester 1', 'The results for B.Tech Semester 1 exams have been released. Check the official website for details.', 'Results', '["B.Tech", "Results", "Semester 1"]', 'published', NOW(), 150);

-- Sample Contact Message
INSERT INTO contact_messages (name, email, message, status) VALUES
('John Doe', 'john@example.com', 'When will the next exam be scheduled?', 'unread');

-- Sample Result
INSERT INTO results (title, exam_type, semester, year, link, status, date, views) VALUES
('B.Tech Semester 1 Results 2024', 'B.Tech', '1st Semester', 2024, 'https://jntuh.ac.in/results', 'Released', NOW(), 500);

-- Sample Note
INSERT INTO notes (title, subject, topic, file_url, file_size, file_type, upload_date, downloads) VALUES
('Data Structures Complete Notes', 'Computer Science', 'Data Structures', 'https://example.com/notes/ds.pdf', 2048000, 'PDF', NOW(), 250);

-- Sample Question
INSERT INTO questions (title, subject, topic, content, difficulty, created_date, views) VALUES
('Explain Binary Search Tree', 'Data Structures', 'Trees', 'Explain the implementation of Binary Search Tree with insertion and deletion operations.', 'Medium', NOW(), 120);

-- Sample Job
INSERT INTO jobs (title, company, salary, job_mode, location, description, apply_link, status, posted_date, applicants) VALUES
('Full Stack Developer', 'Tech Corp', '₹8-12 LPA', 'Remote', 'Hyderabad', 'Looking for a full stack developer with React and Node.js experience.', 'https://example.com/apply/job1', 'Active', NOW(), 45);

-- Sample Internship
INSERT INTO internships (title, company, stipend, duration, mode, location, description, apply_link, status, posted_date, applicants) VALUES
('Frontend Developer Intern', 'StartupXYZ', '₹15,000/month', '3 months', 'Hybrid', 'Bangalore', 'Work on cutting-edge React projects.', 'https://example.com/apply/intern1', 'Active', NOW(), 28);

-- Sample YouTube Video
INSERT INTO youtube_videos (title, video_link, description, category, uploaded_date, views) VALUES
('JNTUH Exam Pattern Explained', 'https://www.youtube.com/watch?v=example', 'Complete guide to JNTUH exam pattern and preparation tips.', 'Exam Info', NOW(), 5000);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify tables were created successfully
-- SELECT * FROM posts;
-- SELECT * FROM contact_messages;
-- SELECT * FROM results;
-- SELECT * FROM notes;
-- SELECT * FROM questions;
-- SELECT * FROM jobs;
-- SELECT * FROM internships;
-- SELECT * FROM youtube_videos;
