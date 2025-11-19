import { Link } from 'react-router-dom';
import { FileText, Mail, Heart } from 'lucide-react';
import logo from 'figma:asset/1cd64d29c347abbc26d8fefe3e909a4610fd103b.png';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Examupdt Logo" className="h-12 w-12 object-contain" />
              <span className="text-[#0A0A0A]">Examupdt</span>
            </Link>
            <p className="text-[#0A0A0A]/60 text-sm">
              Your one-stop platform for all JNTUH updates, results, notes, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#0A0A0A] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/notifications" className="text-[#0A0A0A]/60 hover:text-[#004AAD] text-sm transition-colors">
                  Updates
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-[#0A0A0A]/60 hover:text-[#004AAD] text-sm transition-colors">
                  Results
                </Link>
              </li>
              <li>
                <Link to="/notes" className="text-[#0A0A0A]/60 hover:text-[#004AAD] text-sm transition-colors">
                  Notes
                </Link>
              </li>
              <li>
                <Link to="/jobs-internships" className="text-[#0A0A0A]/60 hover:text-[#004AAD] text-sm transition-colors">
                  Jobs & Internships
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[#0A0A0A] mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/important-questions" className="text-[#0A0A0A]/60 hover:text-[#004AAD] text-sm transition-colors">
                  Important Questions
                </Link>
              </li>
              <li>
                <Link to="/youtube" className="text-[#0A0A0A]/60 hover:text-[#004AAD] text-sm transition-colors">
                  Video Tutorials
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#0A0A0A]/60 hover:text-[#004AAD] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#0A0A0A]/60 hover:text-[#004AAD] text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#0A0A0A] mb-4">Contact</h4>
            <div className="space-y-2">
              <a
                href="mailto:examupdts@gmail.com"
                className="flex items-center gap-2 text-[#0A0A0A]/60 hover:text-[#004AAD] text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>examupdts@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#0A0A0A]/60 text-sm">
            © 2020 Examupdt. All rights reserved.
          </p>
          <p className="text-[#0A0A0A]/60 text-sm">
            made by{' '}
            <a 
              href="https://www.rudracore.site" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#004AAD] hover:underline"
            >
              rudracore
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}