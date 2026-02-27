import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Briefcase, Users, FileText, TrendingUp, Search, Building2, Code, DollarSign, Stethoscope, GraduationCap, Megaphone } from 'lucide-react';
import { useGetActiveJobs } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

const JOB_CATEGORIES = [
  { name: 'IT & Software', icon: Code, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { name: 'Finance', icon: DollarSign, color: 'text-portal-600', bg: 'bg-portal-50 dark:bg-portal-900/20' },
  { name: 'Healthcare', icon: Stethoscope, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { name: 'Engineering', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { name: 'Education', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Marketing', icon: Megaphone, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
];

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: jobs, isLoading: jobsLoading } = useGetActiveJobs();

  const activeJobCount = jobs ? jobs.length : 0;

  const stats = [
    { label: t('totalJobs'), value: activeJobCount.toString(), icon: Briefcase },
    { label: 'Active Listings', value: activeJobCount.toString(), icon: TrendingUp },
    { label: 'Categories', value: JOB_CATEGORIES.length.toString(), icon: Users },
    { label: t('totalApplications'), value: '—', icon: FileText },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-72 sm:h-96 md:h-[480px]">
          <img
            src="/assets/generated/hero-job-portal.dim_1200x500.png"
            alt="AI Job Portal"
            className="w-full h-full object-cover"
            onError={e => {
              const t = e.target as HTMLImageElement;
              t.style.background = 'linear-gradient(135deg, #1e3a5f 0%, #0d9488 100%)';
              t.style.display = 'block';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-portal-900/80 via-portal-800/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl text-white">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                  AI-Powered Recruitment Platform
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight mb-4">
                  {t('heroTitle')}
                </h1>
                <p className="text-sm sm:text-base text-white/85 mb-6 leading-relaxed">
                  {t('heroSubtitle')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow-lg"
                    onClick={() => navigate({ to: '/jobs' })}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {t('browseJobs')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/40 text-white hover:bg-white/20"
                    onClick={() => navigate({ to: identity ? '/employer' : '/about' })}
                  >
                    {t('forEmployers')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-portal-700 dark:bg-portal-800 text-white py-5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {stats.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5 opacity-80" />
                  {jobsLoading ? (
                    <div className="h-7 w-12 bg-white/20 rounded animate-pulse" />
                  ) : (
                    <span className="text-xl font-bold font-display">{stat.value}</span>
                  )}
                  <span className="text-xs opacity-75">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">{t('featuredCategories')}</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/jobs' })} className="text-portal-600">
            {t('viewDetails')} <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {JOB_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Card
                key={cat.name}
                className="card-hover cursor-pointer border border-border"
                onClick={() => navigate({ to: '/jobs' })}
              >
                <CardContent className="p-5 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${cat.bg} mb-3`}>
                    <Icon className={`h-6 w-6 ${cat.color}`} />
                  </div>
                  <p className="font-semibold text-sm">{cat.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-8 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">Latest Jobs</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/jobs' })} className="text-portal-600">
              {t('viewDetails')} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          {jobsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : !jobs || jobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No jobs posted yet. Be the first employer to post a job!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.slice(0, 6).map(job => (
                <Card key={job.id} className="card-hover border border-border bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
                      </div>
                      <span className="text-xs bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.requiredSkills.slice(0, 3).map(s => (
                        <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => navigate({ to: '/jobs/$jobId', params: { jobId: job.id } })}
                    >
                      {t('viewDetails')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-display font-bold text-center mb-10">{t('howItWorks')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Job Seekers */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-teal-600">{t('forJobSeekers')}</h3>
            {[
              { step: 1, title: t('step1Title'), desc: t('step1Desc') },
              { step: 2, title: t('step2Title'), desc: t('step2Desc') },
              { step: 3, title: t('step3Title'), desc: t('step3Desc') },
            ].map(item => (
              <div key={item.step} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
            <Button
              className="bg-teal-500 hover:bg-teal-600 text-white w-full"
              onClick={() => navigate({ to: '/jobs' })}
            >
              {t('browseJobs')} <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-portal-600">{t('forEmployers')}</h3>
            {[
              { step: 1, title: 'Register as Employer', desc: 'Create your account and request admin approval.' },
              { step: 2, title: 'Post Job Openings', desc: 'Describe the role, required skills, and salary range.' },
              { step: 3, title: 'Review AI-Screened Applicants', desc: 'Get ranked applicants with resume scores and skill matches.' },
            ].map(item => (
              <div key={item.step} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-portal-600 text-white flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
            <Button
              className="bg-portal-600 hover:bg-portal-700 text-white w-full"
              onClick={() => navigate({ to: identity ? '/employer' : '/about' })}
            >
              {t('postJob')} <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
