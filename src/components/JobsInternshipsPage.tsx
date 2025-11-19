import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink, Filter } from 'lucide-react';
import { AdSenseSlot } from './AdSenseSlot';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LoadingScreen } from './LoadingScreen';
import { jobsApi, Job } from '../utils/api';
import { toast } from 'sonner';

const filterOptions = ['Latest', 'Trending', 'Stipend', 'Location'];

export function JobsInternshipsPage() {
  const [selectedFilter, setSelectedFilter] = useState('Latest');
  const [isLoading, setIsLoading] = useState(true);
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [internshipsData, setInternshipsData] = useState<Job[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobs, internships] = await Promise.all([
          jobsApi.getJobs(),
          jobsApi.getInternships(),
        ]);
        setJobsData(jobs);
        setInternshipsData(internships);
      } catch (error) {
        console.error('Failed to fetch jobs/internships:', error);
        setJobsData([]);
        setInternshipsData([]);
        toast.error('Failed to fetch jobs/internships');
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchData();
  }, []);

  const sortData = (data: Job[]) => {
    if (selectedFilter === 'Trending') {
      return [...data].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    }
    return data;
  };

  const sortedJobs = sortData(jobsData);
  const sortedInternships = sortData(internshipsData);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const handleApply = (job: Job) => {
    if (job.applyLink) {
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Application link not available');
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
          <h1 className="text-[#0A0A0A] mb-2">Jobs & Internships</h1>
          <p className="text-[#0A0A0A]/60">Explore career opportunities and internship programs</p>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-[#0A0A0A]/60 flex-shrink-0" />
          {filterOptions.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={selectedFilter === filter ? 'bg-[#004AAD]' : ''}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {sortedJobs.length > 0 ? (
              sortedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-[#004AAD] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-[#0A0A0A]">{job.position}</h3>
                            {job.trending && (
                              <Badge variant="secondary" className="bg-red-500/10 text-red-500 text-xs">
                                Trending
                              </Badge>
                            )}
                          </div>
                          <p className="text-[#0A0A0A]/60">{job.company}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-[#0A0A0A]/60 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        {job.experience && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.experience}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(job.postedTime)}</span>
                        </div>
                      </div>
                    </div>

                    <Button className="bg-[#004AAD] w-full md:w-auto" onClick={() => handleApply(job)}>
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <p className="text-[#0A0A0A]/60">No job openings available at the moment.</p>
              </div>
            )}
          </TabsContent>

          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-4">
            {sortedInternships.length > 0 ? (
              sortedInternships.map((internship) => (
                <div
                  key={internship.id}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-[#0A0A0A]">{internship.position}</h3>
                            {internship.trending && (
                              <Badge variant="secondary" className="bg-red-500/10 text-red-500 text-xs">
                                Trending
                              </Badge>
                            )}
                          </div>
                          <p className="text-[#0A0A0A]/60">{internship.company}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-[#0A0A0A]/60 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{internship.location}</span>
                        </div>
                        {internship.stipend && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{internship.stipend}</span>
                          </div>
                        )}
                        {internship.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{internship.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button className="bg-[#004AAD] w-full md:w-auto" onClick={() => handleApply(internship)}>
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <p className="text-[#0A0A0A]/60">No internship opportunities available at the moment.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Bottom AdSense */}
      <div className="container mx-auto px-4 py-6">
        <AdSenseSlot format="horizontal" />
      </div>
    </div>
  );
}