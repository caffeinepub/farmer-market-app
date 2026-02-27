import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Users, Calendar, BarChart3, Plus, Pencil, Trash2, AlertCircle, Loader2, Eye } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import JobPostForm from '../components/JobPostForm';
import InterviewScheduler from '../components/InterviewScheduler';
import EmployerAnalytics from '../components/EmployerAnalytics';
import {
  useGetActiveJobs, useGetAllJobs, useDeleteJob, useGetApplicationsForJob,
  useUpdateApplicationStatus, useIsCallerApproved, useRequestApproval,
  useGetCallerUserProfile, useGetInterviewsScheduledByMe,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../hooks/useLanguage';
import type { JobListing } from '../backend';

export default function EmployerDashboard() {
  return (
    <ProtectedRoute requiredRole="employer">
      <EmployerDashboardContent />
    </ProtectedRoute>
  );
}

function EmployerDashboardContent() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: allJobs, isLoading: jobsLoading } = useGetActiveJobs();
  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();
  const requestApproval = useRequestApproval();
  const deleteJob = useDeleteJob();

  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | undefined>(undefined);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('jobs');

  const myJobs = (allJobs || []).filter(
    j => identity && j.employer.toString() === identity.getPrincipal().toString()
  );

  const handleEdit = (job: JobListing) => {
    setEditingJob(job);
    setShowForm(true);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">
          {t('welcomeBack')}, {userProfile?.name || 'Employer'} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your job postings and applicants</p>
      </div>

      {/* Approval Banner */}
      {!approvalLoading && isApproved === false && (
        <Alert className="mb-6 border-amber-300 bg-amber-50 dark:bg-amber-900/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-amber-800 dark:text-amber-200">{t('pendingApproval')}</span>
            <Button
              size="sm"
              onClick={() => requestApproval.mutateAsync()}
              disabled={requestApproval.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {requestApproval.isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              {requestApproval.isPending ? t('approvalRequested') : t('requestApproval')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="jobs" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Briefcase className="h-3.5 w-3.5" />{t('myJobPosts')}
          </TabsTrigger>
          <TabsTrigger value="applicants" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Users className="h-3.5 w-3.5" />{t('applicants')}
          </TabsTrigger>
          <TabsTrigger value="interviews" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Calendar className="h-3.5 w-3.5" />{t('interviews')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <BarChart3 className="h-3.5 w-3.5" />{t('analytics')}
          </TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          {showForm ? (
            <div className="max-w-2xl">
              <JobPostForm
                job={editingJob}
                onSuccess={() => { setShowForm(false); setEditingJob(undefined); }}
                onCancel={() => { setShowForm(false); setEditingJob(undefined); }}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg">{t('myJobPosts')}</h2>
                <Button
                  onClick={() => { setEditingJob(undefined); setShowForm(true); }}
                  disabled={!isApproved}
                  className="bg-portal-600 hover:bg-portal-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('postNewJob')}
                </Button>
              </div>

              {jobsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : myJobs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">{t('noJobPosts')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead className="text-right">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myJobs.map(job => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell><Badge variant="secondary">{job.jobType}</Badge></TableCell>
                          <TableCell className="text-muted-foreground text-sm">{job.location}</TableCell>
                          <TableCell className="text-sm">{job.salaryRange}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => { setSelectedJobId(job.id); setActiveTab('applicants'); }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(job)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Job Post</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{job.title}"? This cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteJob.mutateAsync(job.id)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      {deleteJob.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('delete')}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Applicants Tab */}
        <TabsContent value="applicants">
          <ApplicantsPanel
            jobs={myJobs}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
          />
        </TabsContent>

        {/* Interviews Tab */}
        <TabsContent value="interviews">
          <InterviewScheduler jobs={myJobs} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <EmployerAnalytics jobs={myJobs} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function ApplicantsPanel({ jobs, selectedJobId, onSelectJob }: {
  jobs: JobListing[];
  selectedJobId: string | null;
  onSelectJob: (id: string) => void;
}) {
  const { t } = useLanguage();
  const activeJobId = selectedJobId || jobs[0]?.id || '';
  const { data: applications, isLoading } = useGetApplicationsForJob(activeJobId);
  const updateStatus = useUpdateApplicationStatus();

  const statusOptions = ['Applied', 'Shortlisted', 'Rejected', 'Hired'];
  const statusClasses: Record<string, string> = {
    Applied: 'badge-status-applied',
    Shortlisted: 'badge-status-shortlisted',
    Rejected: 'badge-status-rejected',
    Hired: 'badge-status-hired',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-display font-semibold text-lg">{t('applicants')}</h2>
        {jobs.length > 0 && (
          <Select value={activeJobId} onValueChange={onSelectJob}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select job" />
            </SelectTrigger>
            <SelectContent>
              {jobs.map(j => (
                <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Post a job first to see applicants.</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : !applications || applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No applicants yet for this job.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map(app => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono text-xs">{app.jobSeekerId.toString().slice(0, 16)}...</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(Number(app.appliedAt) / 1_000_000).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClasses[app.status] || 'bg-muted text-muted-foreground'}`}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={app.status}
                      onValueChange={val => updateStatus.mutateAsync({ applicationId: app.id, newStatus: val })}
                    >
                      <SelectTrigger className="w-32 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
