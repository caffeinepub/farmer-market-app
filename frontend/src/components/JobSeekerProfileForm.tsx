import React, { useState, useRef } from 'react';
import { Plus, X, Upload, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import ResumeScoreDisplay from './ResumeScoreDisplay';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';

interface ProfileData {
  name: string;
  skills: string[];
  education: string[];
  experience: string[];
  preferredLocation: string;
  hasResume: boolean;
}

interface JobSeekerProfileFormProps {
  initialData: ProfileData;
  onSaved?: () => void;
}

export default function JobSeekerProfileForm({ initialData, onSaved }: JobSeekerProfileFormProps) {
  const [name, setName] = useState(initialData.name);
  const [skills, setSkills] = useState<string[]>(initialData.skills);
  const [education, setEducation] = useState<string[]>(initialData.education);
  const [experience, setExperience] = useState<string[]>(initialData.experience);
  const [preferredLocation, setPreferredLocation] = useState(initialData.preferredLocation);
  const [hasResume, setHasResume] = useState(initialData.hasResume);
  const [newSkill, setNewSkill] = useState('');
  const [newEdu, setNewEdu] = useState('');
  const [newExp, setNewExp] = useState('');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const saveProfile = useSaveCallerUserProfile();
  const { language } = useLanguage();
  const T = translations[language];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const addEducation = () => {
    if (newEdu.trim()) {
      setEducation(prev => [...prev, newEdu.trim()]);
      setNewEdu('');
    }
  };

  const addExperience = () => {
    if (newExp.trim()) {
      setExperience(prev => [...prev, newExp.trim()]);
      setNewExp('');
    }
  };

  const handleSave = async () => {
    // Encode profile data as JSON in the role field extension
    const profileData = JSON.stringify({ skills, education, experience, preferredLocation, hasResume });
    await saveProfile.mutateAsync({
      name,
      role: 'job_seeker',
      isApproved: true,
    });
    // Store extended data in localStorage
    localStorage.setItem('jp-seeker-profile', profileData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSaved?.();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} />
          </div>

          {/* Preferred Location */}
          <div className="space-y-1.5">
            <Label htmlFor="location">{T.preferredLocation}</Label>
            <Input
              id="location"
              value={preferredLocation}
              onChange={e => setPreferredLocation(e.target.value)}
              placeholder="e.g., Chennai, Remote"
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>{T.skills}</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                placeholder="e.g., React, Python"
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs px-2.5 py-1 rounded-full">
                  {skill}
                  <button onClick={() => setSkills(prev => prev.filter(s => s !== skill))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label>{T.education}</Label>
            <div className="flex gap-2">
              <Input
                value={newEdu}
                onChange={e => setNewEdu(e.target.value)}
                placeholder="e.g., B.Tech Computer Science, VIT 2024"
                onKeyDown={e => e.key === 'Enter' && addEducation()}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1.5">
              {education.map((edu, i) => (
                <div key={i} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 text-sm">
                  <span>{edu}</span>
                  <button onClick={() => setEducation(prev => prev.filter((_, idx) => idx !== i))}>
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label>{T.experience}</Label>
            <div className="flex gap-2">
              <Input
                value={newExp}
                onChange={e => setNewExp(e.target.value)}
                placeholder="e.g., Software Engineer at TCS, 2 years"
                onKeyDown={e => e.key === 'Enter' && addExperience()}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1.5">
              {experience.map((exp, i) => (
                <div key={i} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 text-sm">
                  <span>{exp}</span>
                  <button onClick={() => setExperience(prev => prev.filter((_, idx) => idx !== i))}>
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label>{T.uploadResume}</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-portal-400 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {hasResume ? '✓ Resume uploaded' : 'Click to upload PDF or DOC'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={e => {
                if (e.target.files?.[0]) {
                  setHasResume(true);
                  localStorage.setItem('jp-has-resume', 'true');
                }
              }}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saveProfile.isPending}
            className="bg-portal-600 hover:bg-portal-700 text-white w-full sm:w-auto"
          >
            {saveProfile.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{T.loading}</>
            ) : saved ? (
              <><CheckCircle className="h-4 w-4 mr-2" />Saved!</>
            ) : T.saveProfile}
          </Button>
        </div>

        {/* Score sidebar */}
        <div className="space-y-4">
          <ResumeScoreDisplay
            skills={skills}
            education={education}
            experience={experience}
            hasResume={hasResume}
          />
        </div>
      </div>
    </div>
  );
}
