import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Mail, Phone, Briefcase, Search, Shield, Zap, Users, Award } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function About() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-64 sm:h-80">
          <img
            src="/assets/generated/hero-job-portal.dim_1200x500.png"
            alt="About AI Job Portal"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-portal-900/80 to-portal-700/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
                {t('aboutTitle')}
              </h1>
              <p className="text-white/85 text-sm sm:text-base max-w-md">
                Empowering careers, connecting talent with opportunity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/30 mb-4">
            <Heart className="h-7 w-7 text-teal-600" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">{t('aboutMission')}</h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            {t('aboutMissionText')} Our platform uses intelligent skill matching, resume scoring, and
            personalized recommendations to ensure every job seeker finds the right opportunity and
            every employer finds the right talent — faster and smarter than ever before.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-center mb-10">{t('howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Job Seekers */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-900/30">
                    <Search className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-display font-bold">{t('forJobSeekers')}</h3>
                </div>
                <img
                  src="/assets/generated/jobseeker-illustration.dim_600x400.png"
                  alt="Job Seeker"
                  className="w-full h-40 object-cover rounded-lg mb-5"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <ol className="space-y-3">
                  {[
                    'Register and select the Job Seeker role',
                    'Build your profile with skills, education, and experience',
                    'Get AI-powered job recommendations based on your skills',
                    'Apply with one click and track your application status',
                    'Download your application summary as a PDF',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
                <Button
                  className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={() => navigate({ to: '/jobs' })}
                >
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>

            {/* For Employers */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-portal-100 dark:bg-portal-900/30">
                    <Briefcase className="h-6 w-6 text-portal-600" />
                  </div>
                  <h3 className="text-xl font-display font-bold">{t('forEmployers')}</h3>
                </div>
                <img
                  src="/assets/generated/employer-illustration.dim_600x400.png"
                  alt="Employer"
                  className="w-full h-40 object-cover rounded-lg mb-5"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <ol className="space-y-3">
                  {[
                    'Register as an Employer and request admin approval',
                    'Post job openings with required skills and salary range',
                    'Review AI-screened applicants ranked by resume score',
                    'Shortlist candidates and schedule interviews',
                    'View analytics on applications and hiring status',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-portal-600 text-white flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
                <Button
                  className="mt-6 w-full bg-portal-600 hover:bg-portal-700 text-white"
                  onClick={() => navigate({ to: '/employer' })}
                >
                  Post a Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-display font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'AI-Powered Matching', desc: 'Our intelligent algorithms match candidates with jobs based on skills, experience, and preferences.', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { icon: Users, title: 'Inclusive Platform', desc: 'We welcome job seekers and employers from all industries and backgrounds.', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
            { icon: Award, title: 'Quality First', desc: 'Admin-verified employers and AI-screened candidates ensure a high-quality experience.', color: 'text-portal-600', bg: 'bg-portal-50 dark:bg-portal-900/20' },
          ].map(val => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="text-center p-6 rounded-2xl bg-card border border-border shadow-card">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${val.bg} mb-3`}>
                  <Icon className={`h-6 w-6 ${val.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{val.title}</h3>
                <p className="text-sm text-muted-foreground">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-portal-700 dark:bg-portal-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">{t('contactUs')}</h2>
          <p className="opacity-90 mb-6">Have questions? We're here to help job seekers and employers alike.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>{t('contactEmail')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
