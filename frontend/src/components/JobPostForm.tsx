import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Loader2, CheckCircle } from 'lucide-react';
import { usePostJob, useUpdateJob } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { JobListing } from '../backend';
import { useLanguage } from '../hooks/useLanguage';

interface JobPostFormProps {
  job?: JobListing;
  onSuccess: () => void;
  onCancel: () => void;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Internship'];

export default function JobPostForm({ job, onSuccess, onCancel }: JobPostFormProps) {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const postJob = usePostJob();
  const updateJob = useUpdateJob();

  const [title, setTitle] = useState(job?.title || '');
  const [description, setDescription] = useState(job?.description || '');
  const [location, setLocation] = useState(job?.location || '');
  const [salaryRange, setSalaryRange] = useState(job?.salaryRange || '');
  const [jobType, setJobType] = useState(job?.jobType || 'Full-time');
  const [skills, setSkills] = useState<string[]>(job?.requiredSkills || []);
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);

  const isEditing = !!job;
  const isPending = postJob.isPending || updateJob.isPending;

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const jobData: JobListing = {
      id: job?.id || `job-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      employer: identity.getPrincipal(),
      title,
      description,
      requiredSkills: skills,
      location,
      salaryRange,
      jobType,
      deadline: BigInt(Date.now() * 1_000_000 + 30 * 24 * 60 * 60 * 1_000_000_000),
      isActive: true,
    };

    if (isEditing) {
      await updateJob.mutateAsync(jobData);
    } else {
      await postJob.mutateAsync(jobData);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); onSuccess(); }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">
      <h2 className="font-display font-semibold text-lg">
        {isEditing ? t('editJob') : t('postNewJob')}
      </h2>

      <div className="space-y-1.5">
        <Label htmlFor="title">Job Title *</Label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Senior React Developer" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Job Description *</Label>
        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} placeholder="Describe the role, responsibilities, and requirements..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="location">{t('location')} *</Label>
          <Input id="location" value={location} onChange={e => setLocation(e.target.value)} required placeholder="e.g., Chennai, Remote" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="salary">{t('salary')} *</Label>
          <Input id="salary" value={salaryRange} onChange={e => setSalaryRange(e.target.value)} required placeholder="e.g., ₹5L - ₹10L" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t('jobType')}</Label>
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('requiredSkills')}</Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            placeholder="e.g., React, Python"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={addSkill}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="flex items-center gap-1 bg-portal-100 dark:bg-portal-900/30 text-portal-700 dark:text-portal-300 text-xs px-2.5 py-1 rounded-full">
              {skill}
              <button type="button" onClick={() => setSkills(prev => prev.filter(s => s !== skill))}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="bg-portal-600 hover:bg-portal-700 text-white">
          {isPending ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('loading')}</>
          ) : saved ? (
            <><CheckCircle className="h-4 w-4 mr-2" />Saved!</>
          ) : isEditing ? t('save') : t('postNewJob')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>{t('cancel')}</Button>
      </div>
    </form>
  );
}
