import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { MapPin, DollarSign, Calendar, Briefcase, ArrowLeft, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import JobApplicationModal from '../components/JobApplicationModal';
import SalaryPredictionCard from '../components/SalaryPredictionCard';
import { useGetActiveJobs } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';

export default function JobDetails() {
  const { jobId } = useParams({ from: '/jobs/$jobId' });
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: jobs, isLoading } = useGetActiveJobs();
  const [applyOpen, setApplyOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('jp-saved-jobs') || '[]');
      return saved.includes(jobId);
    } catch { return false; }
  });

  const job = jobs?.find(j => j.id === jobId);

  const handleSave = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('jp-saved-jobs') || '[]');
      const next = isSaved ? saved.filter(id => id !== jobId) : [...saved, jobId];
      localStorage.setItem('jp-saved-jobs', JSON.stringify(next));
      setIsSaved(!isSaved);
    } catch { /* ignore */ }
  };

  // Get seeker experience years from localStorage profile
  const seekerProfile = (() => {
    try { return JSON.parse(localStorage.getItem('jp-seeker-profile') || '{}'); } catch { return {}; }
  })();
  const experienceYears = (seekerProfile.experience || []).length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-semibold mb-2">Job not found</h2>
        <Button onClick={() => navigate({ to: '/jobs' })} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  const deadlineDate = new Date(Number(job.deadline) / 1_000_000).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const isJobSeeker = identity && userProfile?.role === 'job_seeker';

  // Determine job category for salary prediction
  const jobCategory = job.jobType === 'Full-time' || job.jobType === 'Part-time' || job.jobType === 'Remote'
    ? (job.requiredSkills.some(s => ['React', 'Python', 'Java', 'Node', 'SQL'].includes(s)) ? 'IT' : 'Engineering')
    : 'IT';

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/jobs' })} className="mb-6 -ml-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold mb-1">{job.title}</h1>
                <p className="text-muted-foreground text-sm">{job.employer.toString().slice(0, 20)}...</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSave}>
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-teal-600" />
                ) : (
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.salaryRange}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 flex-shrink-0" />
                <span>{job.jobType}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{deadlineDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-semibold text-lg mb-3">{t('jobDescription')}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Required Skills */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-semibold text-lg mb-3">{t('requiredSkills')}</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map(skill => (
                <span key={skill} className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply Card */}
          <Card className="border border-border">
            <CardContent className="p-5 space-y-3">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{t('applicationDeadline')}:</span>
                <br />{deadlineDate}
              </div>
              {isJobSeeker ? (
                <Button
                  className="w-full bg-portal-600 hover:bg-portal-700 text-white"
                  onClick={() => setApplyOpen(true)}
                >
                  {t('applyForJob')}
                </Button>
              ) : !identity ? (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Login as a Job Seeker to apply</p>
                  <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/' })}>
                    {t('login')}
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center">
                  Only Job Seekers can apply for jobs.
                </p>
              )}
              <Button variant="ghost" size="sm" className="w-full" onClick={handleSave}>
                {isSaved ? (
                  <><BookmarkCheck className="h-4 w-4 mr-2 text-teal-600" />{t('savedJob')}</>
                ) : (
                  <><Bookmark className="h-4 w-4 mr-2" />{t('saveJob')}</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Salary Prediction for Job Seekers */}
          {isJobSeeker && (
            <SalaryPredictionCard
              jobCategory={jobCategory}
              experienceYears={experienceYears}
            />
          )}
        </div>
      </div>

      <JobApplicationModal
        job={job}
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onSuccess={() => navigate({ to: '/seeker' })}
      />
    </main>
  );
}
