import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { MapPin, DollarSign, Calendar, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { JobListing } from '../backend';
import { useLanguage } from '../hooks/useLanguage';

interface JobCardProps {
  job: JobListing;
  isSaved?: boolean;
  onSave?: (jobId: string) => void;
  onApply?: (job: JobListing) => void;
  showApply?: boolean;
}

const jobTypeColors: Record<string, string> = {
  'Full-time': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'Part-time': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Remote': 'bg-portal-100 text-portal-700 dark:bg-portal-900/30 dark:text-portal-300',
  'Internship': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function JobCard({ job, isSaved, onSave, onApply, showApply }: JobCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const deadlineDate = new Date(Number(job.deadline) / 1_000_000).toLocaleDateString();

  return (
    <Card className="card-hover border border-border bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-base text-foreground truncate">{job.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {job.employer.toString().slice(0, 12)}...
            </p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${jobTypeColors[job.jobType] || 'bg-muted text-muted-foreground'}`}>
            {job.jobType}
          </span>
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{job.salaryRange}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{t('deadline')}: {deadlineDate}</span>
          </div>
        </div>

        {job.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.requiredSkills.slice(0, 3).map(skill => (
              <span key={skill} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 3 && (
              <span className="text-xs text-muted-foreground">+{job.requiredSkills.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => navigate({ to: '/jobs/$jobId', params: { jobId: job.id } })}
          >
            {t('viewDetails')}
          </Button>
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => onSave(job.id)}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-teal-600" />
              ) : (
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
          {showApply && onApply && (
            <Button
              size="sm"
              className="bg-portal-600 hover:bg-portal-700 text-white text-xs"
              onClick={() => onApply(job)}
            >
              {t('applyNow')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
