import React from 'react';
import { Calendar, Building2, FileDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { JobApplication, JobListing } from '../backend';
import { useGenerateApplicationPDF } from '../hooks/useGenerateApplicationPDF';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';

interface JobApplicationCardProps {
  application: JobApplication;
  job?: JobListing;
  applicantName: string;
  skills: string[];
}

const statusClasses: Record<string, string> = {
  Applied: 'badge-status-applied',
  Shortlisted: 'badge-status-shortlisted',
  Rejected: 'badge-status-rejected',
  Hired: 'badge-status-hired',
};

export default function JobApplicationCard({ application, job, applicantName, skills }: JobApplicationCardProps) {
  const { generatePDF } = useGenerateApplicationPDF();
  const { language } = useLanguage();
  const T = translations[language];

  const appliedDate = new Date(Number(application.appliedAt) / 1_000_000).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const handleDownloadPDF = () => {
    generatePDF({
      applicantName,
      jobTitle: job?.title || application.jobId,
      employer: job?.employer.toString().slice(0, 20) + '...' || 'Unknown',
      appliedDate,
      status: application.status,
      skills,
      applicationId: application.id,
    });
  };

  return (
    <Card className="border border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{job?.title || application.jobId}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{job?.employer.toString().slice(0, 16)}...</span>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusClasses[application.status] || 'bg-muted text-muted-foreground'}`}>
            {application.status}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3 w-3" />
          <span>{T.applied}: {appliedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 flex-1"
            onClick={handleDownloadPDF}
          >
            <FileDown className="h-3 w-3 mr-1" />
            {T.downloadPDF}
          </Button>
          {job && (
            <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
              <a href={`/jobs/${job.id}`}>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
