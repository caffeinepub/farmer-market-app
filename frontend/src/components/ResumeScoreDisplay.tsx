import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Award, BookOpen, Briefcase, FileText, CheckCircle } from 'lucide-react';

interface ResumeScoreProps {
  skills: string[];
  education: string[];
  experience: string[];
  hasResume: boolean;
}

export function calculateResumeScore(skills: string[], education: string[], experience: string[], hasResume: boolean): number {
  const skillScore = Math.min(skills.length * 4, 40);
  const eduScore = Math.min(education.length * 10, 20);
  const expScore = Math.min(experience.length * 10, 30);
  const resumeScore = hasResume ? 10 : 0;
  return skillScore + eduScore + expScore + resumeScore;
}

export default function ResumeScoreDisplay({ skills, education, experience, hasResume }: ResumeScoreProps) {
  const score = calculateResumeScore(skills, education, experience, hasResume);

  const getScoreColor = () => {
    if (score >= 75) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getProgressColor = () => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const factors = [
    { icon: CheckCircle, label: 'Skills', current: Math.min(skills.length * 4, 40), max: 40, count: skills.length },
    { icon: BookOpen, label: 'Education', current: Math.min(education.length * 10, 20), max: 20, count: education.length },
    { icon: Briefcase, label: 'Experience', current: Math.min(experience.length * 10, 30), max: 30, count: experience.length },
    { icon: FileText, label: 'Resume File', current: hasResume ? 10 : 0, max: 10, count: hasResume ? 1 : 0 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <h3 className="font-display font-semibold text-sm">Resume Score</h3>
        </div>
        <span className={`text-2xl font-bold font-display ${getScoreColor()}`}>{score}/100</span>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="space-y-2">
        {factors.map(({ icon: Icon, label, current, max, count }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground flex-1">{label}</span>
            <span className="text-muted-foreground">{count} added</span>
            <span className={`font-semibold ${current === max ? 'text-green-600' : 'text-foreground'}`}>
              {current}/{max}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
