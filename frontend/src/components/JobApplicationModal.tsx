import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, MapPin, DollarSign } from 'lucide-react';
import type { JobListing } from '../backend';
import { useApplyForJob } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';

interface JobApplicationModalProps {
  job: JobListing | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function JobApplicationModal({ job, open, onClose, onSuccess }: JobApplicationModalProps) {
  const { identity } = useInternetIdentity();
  const applyMutation = useApplyForJob();
  const [applied, setApplied] = useState(false);
  const { language } = useLanguage();
  const T = translations[language];

  const handleApply = async () => {
    if (!job || !identity) return;
    const applicationId = `app-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await applyMutation.mutateAsync({
      id: applicationId,
      jobSeekerId: identity.getPrincipal(),
      jobId: job.id,
      status: 'Applied',
      resume: undefined,
      appliedAt: BigInt(Date.now() * 1_000_000),
    });
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onSuccess?.();
      onClose();
    }, 1500);
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{T.applyForJob}</DialogTitle>
          <DialogDescription>Review the job details before applying</DialogDescription>
        </DialogHeader>

        {applied ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="font-semibold text-lg">Application Submitted!</p>
            <p className="text-sm text-muted-foreground text-center">Your application has been sent successfully.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 py-2">
              <div>
                <h3 className="font-semibold text-base">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.employer.toString().slice(0, 20)}...</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />{job.location}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5" />{job.salaryRange}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map(s => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                By clicking Apply, you confirm that you want to submit your application for this position.
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose}>{T.cancel}</Button>
              <Button
                onClick={handleApply}
                disabled={applyMutation.isPending}
                className="bg-portal-600 hover:bg-portal-700 text-white"
              >
                {applyMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{T.loading}</>
                ) : T.applyNow}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
