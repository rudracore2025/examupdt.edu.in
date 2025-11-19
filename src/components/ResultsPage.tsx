import { useState, useEffect } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LoadingScreen } from './LoadingScreen';
import { resultsApi, Result } from '../utils/api';
import { toast } from 'sonner';

const examFilters = ['All', 'B.Tech 1-1', 'B.Tech 2-2', 'B.Tech 3-1', 'B.Tech 4-2', 'M.Tech', 'MBA'];

export function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [resultUpdates, setResultUpdates] = useState<Result[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await resultsApi.getAll(selectedExam);
        setResultUpdates(results);
      } catch (error) {
        console.error('Failed to fetch results:', error);
        setResultUpdates([]);
        toast.error('Failed to fetch results. Please try again later.');
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchData();
  }, [selectedExam]);

  const filteredResults = resultUpdates.filter((result) => {
    const matchesSearch = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.exam.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDownload = (result: Result) => {
    if (result.pdfLink) {
      window.open(result.pdfLink, '_blank', 'noopener,noreferrer');
      toast.success('Opening result PDF...');
    } else {
      toast.error('PDF link not available');
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
          <h1 className="text-[#0A0A0A] mb-2">JNTUH Results</h1>
          <p className="text-[#0A0A0A]/60">Check and download your examination results</p>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A0A0A]/40" />
            <Input
              type="text"
              placeholder="Search by exam name or semester..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Exam Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-[#0A0A0A]/60 flex-shrink-0" />
            {examFilters.map((exam) => (
              <Button
                key={exam}
                variant={selectedExam === exam ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedExam(exam)}
                className={selectedExam === exam ? 'bg-[#004AAD]' : ''}
              >
                {exam}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Results List */}
      <section className="container mx-auto px-4 py-8">
        {filteredResults.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    {result.status}
                  </Badge>
                  <Badge variant="secondary" className="bg-[#004AAD]/10 text-[#004AAD]">
                    {result.exam}
                  </Badge>
                </div>

                <h3 className="text-[#0A0A0A] mb-2">{result.title}</h3>
                <p className="text-[#0A0A0A]/60 text-sm mb-4">Published on {result.date}</p>

                <Button className="w-full bg-[#004AAD]" onClick={() => handleDownload(result)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-[#0A0A0A]/60">No results found matching your search.</p>
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