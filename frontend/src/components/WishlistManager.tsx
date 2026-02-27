import React from 'react';
import { BookmarkX, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import JobCard from './JobCard';
import type { JobListing } from '../backend';
import { useLanguage } from '../hooks/useLanguage';

interface WishlistManagerProps {
  savedJobs: JobListing[];
  onRemove: (jobId: string) => void;
  onApply?: (job: JobListing) => void;
}

export default function WishlistManager({ savedJobs, onRemove, onApply }: WishlistManagerProps) {
  const { t } = useLanguage();

  if (savedJobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <BookmarkX className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">{t('noWishlist')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg">{t('wishlist')}</h2>
        <span className="text-sm text-muted-foreground">{savedJobs.length} saved</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedJobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={true}
            onSave={onRemove}
            onApply={onApply}
            showApply={!!onApply}
          />
        ))}
      </div>
    </div>
  );
}
