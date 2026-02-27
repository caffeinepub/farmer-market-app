import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Search, Shield, Loader2 } from 'lucide-react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';

interface RoleSelectionModalProps {
  open: boolean;
}

const roles = [
  {
    id: 'job_seeker',
    icon: Search,
    color: 'text-teal-600',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-200 dark:border-teal-700',
    selectedBorder: 'border-teal-500',
    selectedBg: 'bg-teal-50 dark:bg-teal-900/30',
  },
  {
    id: 'employer',
    icon: Briefcase,
    color: 'text-portal-600',
    bg: 'bg-portal-50 dark:bg-portal-900/20',
    border: 'border-portal-200 dark:border-portal-700',
    selectedBorder: 'border-portal-500',
    selectedBg: 'bg-portal-50 dark:bg-portal-900/30',
  },
  {
    id: 'admin',
    icon: Shield,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-700',
    selectedBorder: 'border-amber-500',
    selectedBg: 'bg-amber-50 dark:bg-amber-900/30',
  },
];

export default function RoleSelectionModal({ open }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>('job_seeker');
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();
  const { language } = useLanguage();
  const T = translations[language];

  const roleLabels: Record<string, string> = {
    job_seeker: T.jobSeeker,
    employer: T.employer,
    admin: T.admin,
  };

  const roleDescs: Record<string, string> = {
    job_seeker: T.jobSeekerDesc,
    employer: T.employerDesc,
    admin: T.adminDesc,
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await saveProfile.mutateAsync({
      name: name.trim(),
      role: selectedRole,
      isApproved: selectedRole !== 'employer',
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold">{T.selectRole}</DialogTitle>
          <DialogDescription>{T.selectRoleDesc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name input */}
          <div className="space-y-1.5">
            <Label htmlFor="name">{T.yourName}</Label>
            <Input
              id="name"
              placeholder={T.enterName}
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Role selection */}
          <div className="grid grid-cols-1 gap-3">
            {roles.map(role => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? `${role.selectedBorder} ${role.selectedBg}`
                      : `${role.border} hover:${role.selectedBg}`
                  }`}
                >
                  <div className={`p-2 rounded-lg ${role.bg}`}>
                    <Icon className={`h-5 w-5 ${role.color}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{roleLabels[role.id]}</div>
                    <div className="text-xs text-muted-foreground">{roleDescs[role.id]}</div>
                  </div>
                  {isSelected && (
                    <div className={`ml-auto h-4 w-4 rounded-full ${role.color.replace('text-', 'bg-')} flex items-center justify-center`}>
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full bg-portal-600 hover:bg-portal-700 text-white"
          >
            {saveProfile.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{T.loading}</>
            ) : T.continue}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
