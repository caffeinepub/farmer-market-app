import React, { useState } from 'react';
import { Sparkles, Loader2, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetJobRecommendations, useGetActiveJobs } from '../hooks/useQueries';
import JobCard from './JobCard';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';

interface AIRecommendationsProps {
  skills: string[];
  onSave?: (jobId: string) => void;
  savedJobs?: string[];
  onApply?: (job: import('../backend').JobListing) => void;
}

const categories = ['IT', 'Finance', 'Marketing', 'Engineering', 'Other'];

export default function AIRecommendations({ skills, onSave, savedJobs = [], onApply }: AIRecommendationsProps) {
  const [category, setCategory] = useState('IT');
  const { language } = useLanguage();
  const T = translations[language];

  const { data: recommendations, isLoading: recLoading } = useGetJobRecommendations(skills, category);
  const { data: allJobs } = useGetActiveJobs();

  const recommendedJobs = (recommendations || [])
    .sort((a, b) => Number(b.score) - Number(a.score))
    .map(rec => {
      const job = allJobs?.find(j => j.id === rec.jobId);
      return job ? { job, score: Number(rec.score) } : null;
    })
    .filter(Boolean) as { job: import('../backend').JobListing; score: number }[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="font-display font-semibold text-lg">{T.aiRecommendations}</h2>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {skills.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{T.noRecommendations}</p>
        </div>
      )}

      {skills.length > 0 && recLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-portal-600" />
        </div>
      )}

      {skills.length > 0 && !recLoading && recommendedJobs.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No matching jobs found for your skills in {category}. Try a different category.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedJobs.map(({ job, score }) => (
          <div key={job.id} className="relative">
            <div className="absolute -top-2 -right-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {score} match
            </div>
            <JobCard
              job={job}
              isSaved={savedJobs.includes(job.id)}
              onSave={onSave}
              onApply={onApply}
              showApply={!!onApply}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
