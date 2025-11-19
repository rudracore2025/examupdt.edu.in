import { useState, useEffect } from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { LoadingScreen } from './LoadingScreen';
import { questionsApi, Question } from '../utils/api';

export function ImportantQuestionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await questionsApi.getAll();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
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
          <h1 className="text-[#0A0A0A] mb-2">Important Questions</h1>
          <p className="text-[#0A0A0A]/60">Prepare for your exams with these important questions</p>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Questions List */}
      <section className="container mx-auto px-4 py-8">
        {questions.length > 0 ? (
          <div className="grid gap-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Question Header */}
                <div className="bg-gradient-to-r from-[#004AAD] to-[#0066DD] p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-white mb-2">{question.title}</h2>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          {question.subject}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          {question.topic}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={`border-0 ${
                            question.difficulty === 'Easy' 
                              ? 'bg-green-500/20 text-white' 
                              : question.difficulty === 'Medium'
                              ? 'bg-yellow-500/20 text-white'
                              : 'bg-red-500/20 text-white'
                          }`}
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <BookOpen className="w-5 h-5 text-[#004AAD] flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-[#0A0A0A] whitespace-pre-wrap leading-relaxed">
                        {question.content}
                      </p>
                    </div>
                  </div>

                  {/* Question Image (if exists) */}
                  {question.image_url && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={question.image_url}
                        alt={question.title}
                        className="w-full h-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <HelpCircle className="w-12 h-12 text-[#0A0A0A]/20 mx-auto mb-4" />
            <p className="text-[#0A0A0A]/60">No questions available yet.</p>
            <p className="text-[#0A0A0A]/40 mt-2">Check back later for important questions!</p>
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