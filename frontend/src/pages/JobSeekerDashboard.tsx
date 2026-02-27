import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Search, FileText, Bookmark, Sparkles, Briefcase, BookmarkX } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import JobSeekerProfileForm from '../components/JobSeekerProfileForm';
import JobBrowser from '../components/JobBrowser';
import JobApplicationCard from '../components/JobApplicationCard';
import WishlistManager from '../components/WishlistManager';
import AIRecommendations from '../components/AIRecommendations';
import JobApplicationModal from '../components/JobApplicationModal';
import { useGetCallerUserProfile, useGetMyJobApplications, useGetActiveJobs } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../hooks/useLanguage';
import type { JobListing } from '../backend';

function loadSeekerProfile() {
  try { return JSON.parse(localStorage.getItem('jp-seeker-profile') || '{}'); } catch { return {}; }
}

export default function JobSeekerDashboard() {
  return (
    <ProtectedRoute requiredRole="job_seeker">
      <JobSeekerDashboardContent />
    </ProtectedRoute>
  );
}

function JobSeekerDashboardContent() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: applications, isLoading: appsLoading } = useGetMyJobApplications();
  const { data: allJobs } = useGetActiveJobs();
  const [applyJob, setApplyJob] = useState<JobListing | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [seekerProfile, setSeekerProfile] = useState(loadSeekerProfile);
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('jp-saved-jobs') || '[]'); } catch { return []; }
  });

  const handleSave = (jobId: string) => {
    setSavedJobs(prev => {
      const next = prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId];
      localStorage.setItem('jp-saved-jobs', JSON.stringify(next));
      return next;
    });
  };

  const handleProfileSaved = () => {
    setSeekerProfile(loadSeekerProfile());
  };

  const skills: string[] = seekerProfile.skills || [];
  const education: string[] = seekerProfile.education || [];
  const experience: string[] = seekerProfile.experience || [];
  const preferredLocation: string = seekerProfile.preferredLocation || '';
  const hasResume: boolean = seekerProfile.hasResume || localStorage.getItem('jp-has-resume') === 'true';

  const savedJobObjects = (allJobs || []).filter(j => savedJobs.includes(j.id));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">
          {t('welcomeBack')}, {userProfile?.name || 'Job Seeker'} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your profile, applications, and job search</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <User className="h-3.5 w-3.5" />{t('myProfile')}
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Search className="h-3.5 w-3.5" />{t('browseJobsTab')}
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <FileText className="h-3.5 w-3.5" />{t('myApplications')}
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Bookmark className="h-3.5 w-3.5" />{t('wishlist')}
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Sparkles className="h-3.5 w-3.5" />{t('aiRecommendations')}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-semibold text-lg mb-5">{t('myProfile')}</h2>
            <JobSeekerProfileForm
              initialData={{ name: userProfile?.name || '', skills, education, experience, preferredLocation, hasResume }}
              onSaved={handleProfileSaved}
            />
          </div>
        </TabsContent>

        {/* Browse Jobs Tab */}
        <TabsContent value="browse">
          <JobBrowser
            savedJobs={savedJobs}
            onSave={handleSave}
            onApply={job => setApplyJob(job)}
          />
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg">{t('myApplications')}</h2>
            {appsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
              </div>
            ) : !applications || applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">{t('noApplications')}</p>
                  <Button className="mt-4 bg-portal-600 hover:bg-portal-700 text-white" onClick={() => setActiveTab('browse')}>
                    {t('browseJobsTab')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {applications.map(app => (
                  <JobApplicationCard
                    key={app.id}
                    application={app}
                    job={allJobs?.find(j => j.id === app.jobId)}
                    applicantName={userProfile?.name || 'Applicant'}
                    skills={skills}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <WishlistManager
            savedJobs={savedJobObjects}
            onRemove={handleSave}
            onApply={job => setApplyJob(job)}
          />
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="ai">
          <AIRecommendations
            skills={skills}
            savedJobs={savedJobs}
            onSave={handleSave}
            onApply={job => setApplyJob(job)}
          />
        </TabsContent>
      </Tabs>

      <JobApplicationModal
        job={applyJob}
        open={!!applyJob}
        onClose={() => setApplyJob(null)}
        onSuccess={() => setActiveTab('applications')}
      />
    </main>
  );
}
