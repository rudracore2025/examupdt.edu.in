import { FileText, Users, Target, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';

export function AboutUsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#004AAD] to-[#0066DD] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-white mb-6">About Examupdt</h1>
            <p className="text-white/90 text-lg">
              Your trusted platform for all JNTUH-related academic updates, resources, and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 md:p-12 border border-gray-200">
            <h2 className="text-[#0A0A0A] mb-6">Our Story</h2>
            <div className="space-y-4 text-[#0A0A0A]/80">
              <p>
                Examupdt was founded with a simple yet powerful vision: to create a centralized platform where JNTUH students can access all academic information, resources, and opportunities without hassle.
              </p>
              <p>
                We understand the challenges students face in keeping track of exam schedules, results, study materials, and career opportunities scattered across various sources. That's why we built Examupdt - to bring everything together in one organized, easy-to-use platform.
              </p>
              <p>
                Today, Examupdt serves thousands of JNTUH students, providing timely updates on examinations, comprehensive study notes, important questions, job postings, internship opportunities, and educational video content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-[#F5F5F5] rounded-lg p-8">
              <div className="w-12 h-12 bg-[#004AAD] rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#0A0A0A] mb-4">Our Mission</h3>
              <p className="text-[#0A0A0A]/80">
                To empower JNTUH students with timely, accurate, and comprehensive academic information and resources, helping them excel in their educational journey and career pursuits.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-[#F5F5F5] rounded-lg p-8">
              <div className="w-12 h-12 bg-[#004AAD] rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#0A0A0A] mb-4">Our Vision</h3>
              <p className="text-[#0A0A0A]/80">
                To become the most trusted and comprehensive platform for JNTUH students, serving as their primary source for all academic updates, learning resources, and career opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[#0A0A0A] mb-12 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#0A0A0A] mb-3">Academic Updates</h3>
              <p className="text-[#0A0A0A]/60 text-sm">
                Stay informed with the latest exam schedules, result announcements, academic calendars, and university notifications.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#0A0A0A] mb-3">Study Resources</h3>
              <p className="text-[#0A0A0A]/60 text-sm">
                Access comprehensive notes, important questions, and video tutorials for all subjects across semesters.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#0A0A0A] mb-3">Career Opportunities</h3>
              <p className="text-[#0A0A0A]/60 text-sm">
                Discover job openings and internship programs from top companies, curated specifically for JNTUH students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-br from-[#004AAD] to-[#0066DD] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-white mb-4">Have Questions?</h2>
            <p className="text-white/90 mb-8">
              We're here to help. Reach out to us with any queries or feedback.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#004AAD] rounded-lg hover:bg-white/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}