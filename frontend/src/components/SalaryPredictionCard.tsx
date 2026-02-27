import React from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { usePredictSalary } from '../hooks/useQueries';

interface SalaryPredictionCardProps {
  jobCategory: string;
  experienceYears: number;
}

export default function SalaryPredictionCard({ jobCategory, experienceYears }: SalaryPredictionCardProps) {
  const { data: prediction, isLoading } = usePredictSalary(jobCategory, experienceYears);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-teal-50 to-portal-50 dark:from-teal-900/20 dark:to-portal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
        <span className="text-sm text-muted-foreground">Calculating salary prediction...</span>
      </div>
    );
  }

  if (!prediction) return null;

  const formatSalary = (val: bigint) => `₹${Number(val).toLocaleString('en-IN')}`;

  return (
    <div className="bg-gradient-to-br from-teal-50 to-portal-50 dark:from-teal-900/20 dark:to-portal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-teal-600" />
        <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">AI Salary Prediction</span>
      </div>
      <div className="text-xl font-bold font-display text-foreground">
        {formatSalary(prediction.minSalary)} – {formatSalary(prediction.maxSalary)}
        <span className="text-sm font-normal text-muted-foreground ml-1">/ year</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Based on {Number(prediction.experienceYears)} year(s) of experience in {prediction.jobCategory}
      </p>
    </div>
  );
}
