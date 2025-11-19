import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminQuestions } from './components/admin/AdminQuestions';
import { QuestionForm } from './components/admin/QuestionForm';
import { AdminJobs } from './components/admin/AdminJobs';
import { JobForm } from './components/admin/JobForm';
import { AdminInternships } from './components/admin/AdminInternships';
import { InternshipForm } from './components/admin/InternshipForm';
import { AdminYouTube } from './components/admin/AdminYouTube';
import { YouTubeForm } from './components/admin/YouTubeForm';
import { AdminLogin } from './components/admin/AdminLogin';
import { EnhancedDashboard } from './components/admin/EnhancedDashboard';
import { EnhancedNotifications } from './components/admin/EnhancedNotifications';
import { AdminPostForm } from './components/admin/AdminPostForm';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminResults } from './components/admin/AdminResults';
import { ResultForm } from './components/admin/ResultForm';
import { AdminNotes } from './components/admin/AdminNotes';
import { NoteForm } from './components/admin/NoteForm';
import { HomePage } from './components/HomePage';
import { NotificationsPage } from './components/NotificationsPage';
import { ResultsPage } from './components/ResultsPage';
import { NotesPage } from './components/NotesPage';
import { ImportantQuestionsPage } from './components/ImportantQuestionsPage';
import { JobsInternshipsPage } from './components/JobsInternshipsPage';
import { YouTubePage } from './components/YouTubePage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactUsPage } from './components/ContactUsPage';
import { PostDetailPage } from './components/PostDetailPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
        <Routes>
          {/* Admin login route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin routes - no header/footer, managed by AdminLayout */}
          <Route path="/admin" element={<EnhancedDashboard />} />
          <Route path="/admin/notifications" element={<EnhancedNotifications />} />
          <Route path="/admin/notifications/create" element={<AdminPostForm />} />
          <Route path="/admin/notifications/edit/:id" element={<AdminPostForm />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/results" element={<AdminResults />} />
          <Route path="/admin/results/create" element={<ResultForm />} />
          <Route path="/admin/results/edit/:id" element={<ResultForm />} />
          <Route path="/admin/notes" element={<AdminNotes />} />
          <Route path="/admin/notes/create" element={<NoteForm />} />
          <Route path="/admin/notes/edit/:id" element={<NoteForm />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/questions/create" element={<QuestionForm />} />
          <Route path="/admin/questions/edit/:id" element={<QuestionForm />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/jobs/create" element={<JobForm />} />
          <Route path="/admin/jobs/edit/:id" element={<JobForm />} />
          <Route path="/admin/internships" element={<AdminInternships />} />
          <Route path="/admin/internships/create" element={<InternshipForm />} />
          <Route path="/admin/internships/edit/:id" element={<InternshipForm />} />
          <Route path="/admin/youtube" element={<AdminYouTube />} />
          <Route path="/admin/youtube/create" element={<YouTubeForm />} />
          <Route path="/admin/youtube/edit/:id" element={<YouTubeForm />} />
          
          {/* Public routes - with header/footer */}
          <Route path="/" element={
            <>
              <Header />
              <main className="flex-1">
                <HomePage />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/notifications" element={
            <>
              <Header />
              <main className="flex-1">
                <NotificationsPage />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/results" element={
            <>
              <Header />
              <main className="flex-1">
                <ResultsPage />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/notes" element={
            <>
              <Header />
              <main className="flex-1">
                <NotesPage />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/important-questions" element={
            <>
              <Header />
              <main className="flex-1">
                <ImportantQuestionsPage />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/jobs-internships" element={
            <>
              <Header />
              <main className="flex-1">
                <JobsInternshipsPage />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/youtube" element={
            <>
              <Header />
              <main className="flex-1">
                <YouTubePage />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/about" element={
            <>
              <Header />
              <main className="flex-1">
                <AboutUsPage />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/contact" element={
            <>
              <Header />
              <main className="flex-1">
                <ContactUsPage />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/post/:id" element={
            <>
              <Header />
              <main className="flex-1">
                <PostDetailPage />
              </main>
              <Footer />
            </>
          } />
          
          {/* Catch-all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}