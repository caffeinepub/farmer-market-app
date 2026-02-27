import React, { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Filter, X, Briefcase, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import JobCard from '../components/JobCard';
import JobApplicationModal from '../components/JobApplicationModal';
import { useGetActiveJobs } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import type { JobListing } from '../backend';
import { useLanguage } from '../hooks/useLanguage';

const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Remote', 'Internship'];

export default function JobListings() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: jobs, isLoading } = useGetActiveJobs();

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All Types');
  const [salaryMin, setSalaryMin] = useState(0);
  const [applyJob, setApplyJob] = useState<JobListing | null>(null);

  // Get unique locations
  const locations = useMemo(() => {
    const locs = new Set((jobs || []).map(j => j.location));
    return ['All Locations', ...Array.from(locs)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return (jobs || []).filter(job => {
      const matchesSearch = !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.requiredSkills.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchesLocation = !location || location === 'All Locations' || job.location === location;
      const matchesType = jobType === 'All Types' || job.jobType === jobType;
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, search, location, jobType]);

  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('jp-saved-jobs') || '[]'); } catch { return []; }
  });

  const handleSave = (jobId: string) => {
    setSavedJobs(prev => {
      const next = prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId];
      localStorage.setItem('jp-saved-jobs', JSON.stringify(next));
      return next;
    });
  };

  const handleApply = (job: JobListing) => {
    if (!identity) { navigate({ to: '/' }); return; }
    setApplyJob(job);
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('All Types');
    setSalaryMin(0);
  };

  const hasFilters = search || (location && location !== 'All Locations') || jobType !== 'All Types';

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold">{t('jobs')}</h1>
        <p className="text-muted-foreground mt-1">
          {isLoading ? t('loading') : `${filteredJobs.length} jobs found`}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchJobs')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={location || 'All Locations'} onValueChange={setLocation}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('filterByLocation')} />
            </SelectTrigger>
            <SelectContent>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" />
              {t('clearFilters')}
            </Button>
          )}
        </div>

        {/* Active filter badges */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2">
            {search && (
              <Badge variant="secondary" className="gap-1">
                Search: {search}
                <button onClick={() => setSearch('')}><X className="h-3 w-3" /></button>
              </Badge>
            )}
            {location && location !== 'All Locations' && (
              <Badge variant="secondary" className="gap-1">
                {location}
                <button onClick={() => setLocation('')}><X className="h-3 w-3" /></button>
              </Badge>
            )}
            {jobType !== 'All Types' && (
              <Badge variant="secondary" className="gap-1">
                {jobType}
                <button onClick={() => setJobType('All Types')}><X className="h-3 w-3" /></button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Job Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">{t('noJobsFound')}</p>
          {hasFilters && (
            <Button variant="link" onClick={clearFilters} className="mt-2">
              {t('clearFilters')}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobs.includes(job.id)}
              onSave={handleSave}
              onApply={identity && userProfile?.role === 'job_seeker' ? handleApply : undefined}
              showApply={!!identity && userProfile?.role === 'job_seeker'}
            />
          ))}
        </div>
      )}

      <JobApplicationModal
        job={applyJob}
        open={!!applyJob}
        onClose={() => setApplyJob(null)}
        onSuccess={() => navigate({ to: '/seeker' })}
      />
    </main>
  );
}
