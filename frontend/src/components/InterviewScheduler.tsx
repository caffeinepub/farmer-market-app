import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Loader2, CheckCircle } from 'lucide-react';
import { useScheduleInterview, useGetInterviewsScheduledByMe } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import type { JobListing } from '../backend';
import { useLanguage } from '../hooks/useLanguage';
import { Principal } from '@dfinity/principal';

interface InterviewSchedulerProps {
  jobs: JobListing[];
}

export default function InterviewScheduler({ jobs }: InterviewSchedulerProps) {
  const { t } = useLanguage();
  const scheduleInterview = useScheduleInterview();
  const { data: interviews, isLoading } = useGetInterviewsScheduledByMe();

  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [applicantPrincipal, setApplicantPrincipal] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId || !applicantPrincipal || !date || !time) return;

    let applicantId: Principal;
    try {
      applicantId = Principal.fromText(applicantPrincipal);
    } catch {
      alert('Invalid Principal ID');
      return;
    }

    const scheduledDate = BigInt(new Date(`${date}T${time}`).getTime() * 1_000_000);
    await scheduleInterview.mutateAsync({
      id: `interview-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      applicantId,
      jobId: selectedJobId,
      scheduledDate,
      notes,
    });
    setScheduled(true);
    setApplicantPrincipal('');
    setDate('');
    setTime('');
    setNotes('');
    setTimeout(() => setScheduled(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display font-semibold text-lg">{t('interviews')}</h2>

      {/* Schedule Form */}
      <Card className="border border-border">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-4">{t('scheduleInterview')}</h3>
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Post a job first to schedule interviews.</p>
          ) : (
            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Job</Label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map(j => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Applicant Principal ID</Label>
                  <Input
                    value={applicantPrincipal}
                    onChange={e => setApplicantPrincipal(e.target.value)}
                    placeholder="aaaaa-bbbbb-..."
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('interviewDate')}</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Time</Label>
                  <Input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t('interviewNotes')}</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes..." />
              </div>
              <Button type="submit" disabled={scheduleInterview.isPending} className="bg-portal-600 hover:bg-portal-700 text-white">
                {scheduleInterview.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('loading')}</>
                ) : scheduled ? (
                  <><CheckCircle className="h-4 w-4 mr-2" />Scheduled!</>
                ) : t('scheduleBtn')}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Interviews List */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Scheduled Interviews</h3>
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : !interviews || interviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noInterviews')}</p>
        ) : (
          <div className="space-y-2">
            {interviews.map(iv => (
              <Card key={iv.id} className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-teal-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Job: {iv.jobId.slice(0, 16)}...</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Number(iv.scheduledDate) / 1_000_000).toLocaleString()}
                    </p>
                    {iv.notes && <p className="text-xs text-muted-foreground mt-0.5">{iv.notes}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
