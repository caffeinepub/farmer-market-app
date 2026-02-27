import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Briefcase, Users, CheckCircle, XCircle, Award, Loader2 } from 'lucide-react';
import { useGetApplicationsForJob } from '../hooks/useQueries';
import type { JobListing } from '../backend';
import { useLanguage } from '../hooks/useLanguage';

interface EmployerAnalyticsProps {
  jobs: JobListing[];
}

function JobStats({ job }: { job: JobListing }) {
  const { data: applications, isLoading } = useGetApplicationsForJob(job.id);

  if (isLoading) {
    return (
      <Card className="border border-border">
        <CardContent className="p-5 flex items-center justify-center h-32">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const apps = applications || [];
  const total = apps.length;
  const shortlisted = apps.filter(a => a.status === 'Shortlisted').length;
  const rejected = apps.filter(a => a.status === 'Rejected').length;
  const hired = apps.filter(a => a.status === 'Hired').length;
  const applied = apps.filter(a => a.status === 'Applied').length;

  const chartData = [
    { name: 'Applied', value: applied, color: '#3B82F6' },
    { name: 'Shortlisted', value: shortlisted, color: '#F59E0B' },
    { name: 'Hired', value: hired, color: '#10B981' },
    { name: 'Rejected', value: rejected, color: '#EF4444' },
  ];

  return (
    <Card className="border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold truncate">{job.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Total', value: total, icon: Users, color: 'text-portal-600' },
            { label: 'Shortlisted', value: shortlisted, icon: CheckCircle, color: 'text-amber-600' },
            { label: 'Hired', value: hired, icon: Award, color: 'text-green-600' },
            { label: 'Rejected', value: rejected, icon: XCircle, color: 'text-red-500' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />
                <p className="text-lg font-bold font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
        {total > 0 && (
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default function EmployerAnalytics({ jobs }: EmployerAnalyticsProps) {
  const { t } = useLanguage();

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>{t('noJobPosts')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display font-semibold text-lg">{t('analytics')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(job => <JobStats key={job.id} job={job} />)}
      </div>
    </div>
  );
}
