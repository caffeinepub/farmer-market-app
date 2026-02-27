import React, { useState, useMemo } from 'react';
import { Search, X, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import JobCard from './JobCard';
import { useGetActiveJobs } from '../hooks/useQueries';
import type { JobListing } from '../backend';
import { useLanguage } from '../hooks/useLanguage';

const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Remote', 'Internship'];

interface JobBrowserProps {
  savedJobs?: string[];
  onSave?: (jobId: string) => void;
  onApply?: (job: JobListing) => void;
}

export default function JobBrowser({ savedJobs = [], onSave, onApply }: JobBrowserProps) {
  const { t } = useLanguage();
  const { data: jobs, isLoading } = useGetActiveJobs();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All Types');

  const locations = useMemo(() => {
    const locs = new Set((jobs || []).map(j => j.location));
    return ['All Locations', ...Array.from(locs)];
  }, [jobs]);

  const filtered = useMemo(() => {
    return (jobs || []).filter(job => {
      const matchSearch = !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.requiredSkills.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchLoc = !location || location === 'All Locations' || job.location === location;
      const matchType = jobType === 'All Types' || job.jobType === jobType;
      return matchSearch && matchLoc && matchType;
    });
  }, [jobs, search, location, jobType]);

  const hasFilters = search || (location && location !== 'All Locations') || jobType !== 'All Types';

  const clearFilters = () => { setSearch(''); setLocation(''); setJobType('All Types'); };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchJobs')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={location || 'All Locations'} onValueChange={setLocation}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-muted-foreground">
              <X className="h-4 w-4 mr-1" />{t('clearFilters')}
            </Button>
          )}
        </div>
        {hasFilters && (
          <div className="flex flex-wrap gap-1.5">
            {search && <Badge variant="secondary" className="gap-1 text-xs">{search}<button onClick={() => setSearch('')}><X className="h-3 w-3" /></button></Badge>}
            {location && location !== 'All Locations' && <Badge variant="secondary" className="gap-1 text-xs">{location}<button onClick={() => setLocation('')}><X className="h-3 w-3" /></button></Badge>}
            {jobType !== 'All Types' && <Badge variant="secondary" className="gap-1 text-xs">{jobType}<button onClick={() => setJobType('All Types')}><X className="h-3 w-3" /></button></Badge>}
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-8 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">{t('noJobsFound')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobs.includes(job.id)}
              onSave={onSave}
              onApply={onApply}
              showApply={!!onApply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
