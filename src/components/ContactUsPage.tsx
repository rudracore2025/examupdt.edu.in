import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { LoadingScreen } from './LoadingScreen';
import { contactApi } from '../utils/api';

export function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactApi.send(formData);
      
      toast.success('Message sent successfully!', {
        description: 'We\'ll get back to you as soon as possible.',
      });
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-[#0A0A0A] mb-2">Contact Us</h1>
          <p className="text-[#0A0A0A]/60">Get in touch with us. We'd love to hear from you!</p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-[#0A0A0A] mb-6">Get in Touch</h2>
              <p className="text-[#0A0A0A]/80 mb-8">
                Have a question, suggestion, or feedback? We're here to help! Fill out the form or reach us through the contact details below.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#004AAD] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#0A0A0A] mb-1">Email</h3>
                  <a
                    href="mailto:examupdts@gmail.com"
                    className="text-[#004AAD] hover:underline"
                  >
                    examupdts@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#004AAD] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#0A0A0A] mb-1">Phone</h3>
                  <a
                    href="tel:+919876543210"
                    className="text-[#004AAD] hover:underline"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#004AAD] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#0A0A0A] mb-1">Address</h3>
                  <p className="text-[#0A0A0A]/80">
                    Hyderabad, Telangana<br />
                    India - 500001
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-[#0A0A0A] mb-2">Response Time</h4>
              <p className="text-[#0A0A0A]/60 text-sm">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-[#0A0A0A] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#004AAD]" size="lg" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>

            {/* Privacy Note */}
            <p className="text-[#0A0A0A]/40 text-xs mt-6 text-center">
              By submitting this form, you agree to our privacy policy. We will never share your information with third parties.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}