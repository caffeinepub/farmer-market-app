import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Users, CheckCircle, XCircle, Briefcase, BarChart3, Loader2, Trash2, Shield,
  FileText, TrendingUp, UserCheck, UserX,
} from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import {
  useListApprovals, useSetApproval, useGetAllJobs, useAdminRemoveJob, useGetSystemReport,
} from '../hooks/useQueries';
import { ApprovalStatus } from '../backend';
import { Principal } from '@dfinity/principal';
import { useLanguage } from '../hooks/useLanguage';

export default function AdminPanel() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPanelContent />
    </ProtectedRoute>
  );
}

function AdminPanelContent() {
  const { t } = useLanguage();
  const { data: approvals, isLoading: approvalsLoading } = useListApprovals();
  const { data: allJobs, isLoading: jobsLoading } = useGetAllJobs();
  const { data: report, isLoading: reportLoading } = useGetSystemReport();
  const setApproval = useSetApproval();
  const removeJob = useAdminRemoveJob();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingApprovals = (approvals || []).filter(a => a.status === ApprovalStatus.pending);
  const allUsers = approvals || [];

  const handleApprove = async (principal: Principal) => {
    setProcessingId(principal.toString());
    await setApproval.mutateAsync({ user: principal, status: ApprovalStatus.approved });
    setProcessingId(null);
  };

  const handleReject = async (principal: Principal) => {
    setProcessingId(principal.toString());
    await setApproval.mutateAsync({ user: principal, status: ApprovalStatus.rejected });
    setProcessingId(null);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  // Compute total users from role breakdown
  const totalUsers = report
    ? Number(report.totalUsersByRole.jobSeekers) +
      Number(report.totalUsersByRole.employers) +
      Number(report.totalUsersByRole.admins)
    : 0;

  const reportCards = [
    {
      label: 'Job Seekers',
      value: report ? Number(report.totalUsersByRole.jobSeekers) : 0,
      icon: Users,
      color: 'text-teal-600',
      bg: 'bg-teal-50 dark:bg-teal-900/20',
    },
    {
      label: 'Employers',
      value: report ? Number(report.totalUsersByRole.employers) : 0,
      icon: Briefcase,
      color: 'text-portal-600',
      bg: 'bg-portal-50 dark:bg-portal-900/20',
    },
    {
      label: 'Admins',
      value: report ? Number(report.totalUsersByRole.admins) : 0,
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: UserCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Active Jobs',
      value: report ? Number(report.totalJobs) : 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Applications',
      value: report ? Number(report.totalApplications) : 0,
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Total Hires',
      value: report ? Number(report.totalHires) : 0,
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Rejected',
      value: report
        ? Number(report.totalApplications) - Number(report.totalHires)
        : 0,
      icon: UserX,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-portal-100 dark:bg-portal-900/30 rounded-lg">
          <Shield className="h-6 w-6 text-portal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{t('adminPanel')}</h1>
          <p className="text-muted-foreground text-sm">Manage users, approvals, and platform content</p>
        </div>
      </div>

      <Tabs defaultValue="approvals">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="approvals" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <CheckCircle className="h-3.5 w-3.5" />
            {t('employerApprovals')}
            {pendingApprovals.length > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingApprovals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Users className="h-3.5 w-3.5" />{t('userManagement')}
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Briefcase className="h-3.5 w-3.5" />{t('jobMonitoring')}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <BarChart3 className="h-3.5 w-3.5" />{t('systemReports')}
          </TabsTrigger>
        </TabsList>

        {/* Employer Approvals */}
        <TabsContent value="approvals">
          <h2 className="font-display font-semibold text-lg mb-4">{t('employerApprovals')}</h2>
          {approvalsLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>{t('noPendingApprovals')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Principal ID</TableHead>
                    <TableHead>{t('userStatus')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.map(approval => {
                    const pid = approval.principal.toString();
                    const isProcessing = processingId === pid;
                    return (
                      <TableRow key={pid}>
                        <TableCell className="font-mono text-xs">{pid.slice(0, 20)}...</TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[approval.status] || ''}`}>
                            {approval.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                              onClick={() => handleApprove(approval.principal)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                              {t('approve')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 text-xs"
                              onClick={() => handleReject(approval.principal)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
                              {t('reject')}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users">
          <h2 className="font-display font-semibold text-lg mb-4">{t('userManagement')}</h2>
          {approvalsLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : allUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No users registered yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Principal ID</TableHead>
                    <TableHead>{t('userStatus')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map(user => {
                    const pid = user.principal.toString();
                    const isProcessing = processingId === pid;
                    return (
                      <TableRow key={pid}>
                        <TableCell className="font-mono text-xs">{pid.slice(0, 24)}...</TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[user.status] || ''}`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.status !== ApprovalStatus.approved && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                                onClick={() => handleApprove(user.principal)}
                                disabled={isProcessing}
                              >
                                {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : t('approve')}
                              </Button>
                            )}
                            {user.status !== ApprovalStatus.rejected && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 text-xs"
                                onClick={() => handleReject(user.principal)}
                                disabled={isProcessing}
                              >
                                {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : t('reject')}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Job Monitoring */}
        <TabsContent value="jobs">
          <h2 className="font-display font-semibold text-lg mb-4">{t('jobMonitoring')}</h2>
          {jobsLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : !allJobs || allJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No jobs posted yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allJobs.map(job => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium text-sm">{job.title}</TableCell>
                      <TableCell><Badge variant="secondary">{job.jobType}</Badge></TableCell>
                      <TableCell className="text-muted-foreground text-sm">{job.location}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${job.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-muted text-muted-foreground'}`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeJob.mutateAsync(job.id)}
                          disabled={removeJob.isPending}
                        >
                          {removeJob.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* System Reports */}
        <TabsContent value="reports">
          <h2 className="font-display font-semibold text-lg mb-6">{t('systemReports')}</h2>
          {reportLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
          ) : !report ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No report data available.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {reportCards.map(card => {
                const Icon = card.icon;
                return (
                  <Card key={card.label} className="border border-border">
                    <CardContent className="p-5 text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.bg} mb-3`}>
                        <Icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                      <p className="text-2xl font-bold font-display">{card.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
